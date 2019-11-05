const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const helpScene = new Scene('help');

//menu scene enter
helpScene.enter(ctx => {
  if (typeof ctx.session.user === 'undefined') {
    return ctx.scene.enter('auth');
  }
  return ctx.reply(
    'Данный бот поможет вам найти поставщиков где и когда угодно.',
    Markup.keyboard([
      ['💡 О сервисе'],
      ['🗣 Заказчикам', '👤 Поставщикам'],
      ['📚 База знаний'],
      ['⬅️ Главное меню'],
    ])
      .oneTime()
      .resize()
      .extra(),
  );
});

helpScene.hears('💡 О сервисе', ctx => {
  ctx.scene.enter('about');
});

helpScene.hears('🗣 Заказчикам', ctx => {
  ctx.scene.enter('forCustomers');
});

helpScene.hears('👤 Поставщикам', ctx => {
  ctx.scene.enter('forProviders');
});

helpScene.hears('📚 База знаний', ctx => {
  ctx.scene.enter('faq');
});

helpScene.hears('⬅️ Главное меню', ctx => {
  ctx.scene.enter('menu');
});

helpScene.use(ctx => {
  ctx.reply('Используйте меню.');
});

module.exports = helpScene;
