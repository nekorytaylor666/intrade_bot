/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const menuScene = new Scene('menu');

const checkUserForOutDatingOrders = require('../helpers/activeOrdersChecker');




//menu scene enter
menuScene.enter((ctx) => {
    if (typeof ctx.session.user === 'undefined') {
        return ctx.scene.enter('auth');
    }
    return ctx.reply('Данный бот поможет вам найти поставщиков где и когда угодно.', Markup
        .keyboard([
            ['🔍 Заказы'], // Row1 with 2 buttons
            ['☸ Настройки', '📞 Помощь'], // Row2 with 2 buttons
            ['⭐️ Оплата', '👥 Контакты'] // Row3 with 3 buttons
        ])
        .oneTime()
        .resize()
        .extra()
    );
});
menuScene.hears('🔍 Заказы', (ctx) => {
    ctx.scene.enter('orders');
});
// menuScene.hears('neworder', (ctx) => {
//     ctx.editMessageText('This bot hepls you find new providers or buy something.', Extra.HTML().markup(m => m.inlineKeyboard([])));
//     ctx.scene.enter('orderRegistration');
// });

menuScene.command('test', () => {
    checkUserForOutDatingOrders();
});


module.exports = menuScene;