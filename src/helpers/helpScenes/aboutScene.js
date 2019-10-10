/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const about = new Scene('about');

about.enter(async ctx => {
  ctx.reply(
    `👨🏻‍💻 Уважаемые клиенты, компания INTRADE сменила своё направление.

    🎇 Теперь INTRADE - это онлайн сервис поиска поставщиков товаров и услуг, с помощью которого Вы сможете найти нужного поставщика в 2 клика.
    
    🧭 Мы упрощаем поиск поставщиков экономив Вам время и деньги. 
    🛡 В нашем сервисе будут размещены только надежные поставщики, прошедшие проверку для Вашей безопастности
    
    🗳 Для поставщиков мы даем поток горячих заказов на предоставляемые Вашей компанией товары или услуги.
    
    По всем вопросам: @baelov`,
    Markup.keyboard([['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
});

about.hears('Назад', ctx => {
  ctx.scene.enter('help');
});

module.exports = about;
