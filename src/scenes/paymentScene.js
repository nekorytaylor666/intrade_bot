const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const paymentScene = new Scene('payments');

paymentScene.enter(ctx => {
  ctx.reply('hi');
});

paymentScene.command('leave', ctx => {
  ctx.scene.leave();
  ctx.scene.enter('menu');
});

module.exports = paymentScene;
