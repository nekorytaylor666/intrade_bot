const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const settings = new Scene('settings');

settings.enter(ctx => {
  if (typeof ctx.session.user === 'undefined') {
    return ctx.scene.enter('auth');
  }
  return ctx.reply(
    'Данный бот поможет вам найти поставщиков где и когда угодно.',
    Markup.keyboard([
      ['👤 Личный кабинет'],
      ['📚 Категории заказов'],
      ['⬅️ Главное меню'],
    ])
      .resize()
      .extra(),
  );
});

settings.hears('👤 Личный кабинет', ctx => {
  ctx.scene.enter('contactEdit');
});

settings.hears('📚 Категории заказов', ctx => {
  ctx.scene.enter('contactEdit');
});
settings.hears('⬅️ Главное меню', ctx => {
  ctx.scene.enter('menu');
});

module.exports = settings;
