/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const menuScene = new Scene('menu');

//menu scene enter
menuScene.enter(ctx => {
  if (typeof ctx.session.user === 'undefined') {
    return ctx.scene.enter('auth');
  }
  return ctx.reply(
    'Данный бот поможет вам найти поставщиков где и когда угодно.',
    Markup.keyboard([
      ['🔍 Заказы'], // Row1 with 2 buttons
      ['☸ Настройки', '📞 Помощь'], // Row2 with 2 buttons
      ['⭐️ Оплата', '👥 Контакты'], // Row3 with 3 buttons
    ])
      .oneTime()
      .resize()
      .extra(),
  );
});
menuScene.hears('🔍 Заказы', ctx => {
  ctx.scene.enter('orders');
});

menuScene.hears('📞 Помощь', ctx => {
  ctx.scene.enter('help');
});

menuScene.use(ctx => {
  ctx.reply('Используйте меню.');
});

module.exports = menuScene;
