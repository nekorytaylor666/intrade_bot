const Scene = require('telegraf/scenes/base');
const { Extra, Markup } = require('telegraf');
const orders = new Scene('orders');

orders.enter(async ctx => {
  ctx.reply(
    'Здесь вы можете просмотреть ваши заказы.',
    Markup.keyboard([
      ['🆕 Добавить заказ'], // Row1 with 2 buttons
      ['📃 Мои заказы'], // Row2 with 2 buttons
      ['☎️ Активные заказы'], // Row3 with 3 buttons
      ['Главное меню'], // Row3 with 3 buttons
    ])
      .resize()
      .extra(),
  );
});

orders.hears('🆕 Добавить заказ', ctx => {
  ctx.scene.enter('orderReg');
});
orders.hears('📃 Мои заказы', ctx => {
  ctx.scene.enter('orderList');
});
orders.hears('⛏ Заказы в работе', ctx => {
  ctx.reply('Будет добавлено в следующем обновлении.');
});
orders.hears('☎️ Активные заказы', ctx => {
  ctx.reply(
    'Все заказы мы публикуем в нашем официальном канале.',
    Markup.inlineKeyboard(
      [
        Markup.urlButton(
          'канал Intrade',
          `https://t.me/intrade_providers`,
        ),
      ],
      {
        columns: 1,
      },
    ).extra(),
  );
});
orders.hears('Главное меню', ctx => {
  ctx.scene.enter('menu');
});

orders.use(ctx => {
  ctx.reply('Используйте меню.');
});

module.exports = orders;
