const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const forCustomers = new Scene('forCustomers');

forCustomers.enter(async ctx => {
  ctx.reply(
    `Заказчикам. 
    Находите поставщиков в кратчайшие сроки и получайте самые выгодные предложения.
    Мы экономим Ваше время и деньги.`,
    Markup.keyboard([['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
  ctx.replyWithPhoto({
    source: 'src/static/helpImageCustomers.jpeg',
  });
});

forCustomers.hears('Назад', ctx => {
  ctx.scene.enter('help');
});

module.exports = forCustomers;
