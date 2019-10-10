/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const forProviders = new Scene('forProviders');

forProviders.enter(async ctx => {
  ctx.reply(
    `Поставщикам. 
    Наша площадка предоставляет для Вас горячие заказы от заинтересованных компаний. Вам больше не нужно думать где найти клиентов, все в одном месте.`,
    Markup.keyboard([['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
  ctx.replyWithPhoto({
    source: path.normalize('src/static/helpImageProviders.jpeg'),
  });
});

forProviders.hears('Назад', ctx => {
  ctx.scene.enter('help');
});

module.exports = forProviders;
