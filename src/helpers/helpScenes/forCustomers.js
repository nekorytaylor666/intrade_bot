/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const path = require('path');

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
    source: path.normalize('src/static/helpImageCustomers.jpeg'),
  });
});

forCustomers.hears('Назад', ctx => {
  ctx.scene.enter('help');
});

module.exports = forCustomers;
