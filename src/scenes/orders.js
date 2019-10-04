/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const {
    Extra,
    Markup
} = require('telegraf');
const orders = new Scene('orders');

orders.enter(async (ctx) => {

    ctx.reply('Здесь вы можете просмотреть ваши заказы.', Markup
        .keyboard([
            ['🔍 Добавить заказ'], // Row1 with 2 buttons
            ['☸ Мои заказы'], // Row2 with 2 buttons
            ['⭐️ Заказы в работе', '👥 Активные заказы'], // Row3 with 3 buttons
            ['Главное меню'], // Row3 with 3 buttons
        ])
        .oneTime()
        .resize()
        .extra()
    );
});

orders.hears('🔍 Добавить заказ', (ctx) => {
    ctx.scene.enter('orderReg');
});
orders.hears('☸ Мои заказы', (ctx) => {
    ctx.scene.enter('orderList');
});
orders.hears('Главное меню', (ctx) => {
    ctx.scene.enter('menu');
});

module.exports = orders;