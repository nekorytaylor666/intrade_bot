const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');
const Composer = require('telegraf/composer');

const providerFillHandler = require('../helpers/providerFillHandler/providerFillHandler');
const acceptHandler = require('../helpers/acceptHandler/acceptHandler');

const menuScene = new Scene('menu');

//menu scene enter
menuScene.enter(ctx => {
  if (typeof ctx.session.user === 'undefined') {
    return ctx.scene.enter('auth');
  }
  return ctx.reply(
    'Данный бот поможет вам найти поставщиков где и когда угодно.',
    Markup.keyboard([
      ['📰 Заказы'],
      ['⚙️ Настройки'],
      ['👥 Контакты', '💵 Оплата'],
    ])
      .resize()
      .extra(),
  );
});
menuScene.hears('📰 Заказы', async ctx => {
  const user = ctx.session.user;
  if (!user.companyName || !user.email) {
    await ctx.reply(
      'Для добавления заказа вы должны ввести недостающие контакты в настройках, это обязательная часть.',
    );
    return ctx.scene.enter('contactEdit');
  }
  ctx.scene.enter('orders');
});

menuScene.hears('⚙️ Настройки', ctx => {
  ctx.scene.enter('settings');
});

menuScene.hears('💵 Оплата', ctx => {
  ctx.scene.enter('payments');
});

menuScene.hears('❔ Помощь', ctx => {
  ctx.scene.enter('help');
});
menuScene.hears('👥 Контакты', ctx => {
  ctx.reply(`👨🏻‍💻 Уважаемые клиенты, компания INTRADE сменила своё направление.

  🎇 Теперь INTRADE - это онлайн сервис поиска поставщиков товаров и услуг, с помощью которого Вы сможете найти нужного поставщика в 2 клика.
  
  🧭 Мы упрощаем поиск поставщиков экономив Вам время и деньги. 
  🛡 В нашем сервисе будут размещены только надежные поставщики, прошедшие проверку для Вашей безопастности
  
  🗳 Для поставщиков мы даем поток горячих заказов на предоставляемые Вашей компанией товары или услуги.
  
  По всем вопросам: @baelov`);
});

menuScene.use(providerFillHandler);
menuScene.use(acceptHandler);

menuScene.on('callback_query', ctx => {
  ctx.answerCbQuery(
    'Невозможно обработать данную команду для данного контекста',
  );
});

menuScene.use(ctx => {
  ctx.reply('Используйте меню.');
});

module.exports = menuScene;
