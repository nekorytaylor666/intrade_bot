const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

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
      ['📰 Заказы'], // Row1 with 2 buttons
      ['☸ Настройки', '❔ Помощь'], // Row2 with 2 buttons
      ['📈 Оплата', '👥 Контакты'], // Row3 with 3 buttons
    ])
      .oneTime()
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

menuScene.hears('☸ Настройки', ctx => {
  ctx.scene.enter('settings');
});

menuScene.hears('❔ Помощь', ctx => {
  ctx.scene.enter('help');
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
