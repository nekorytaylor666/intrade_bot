/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const {
    Extra,
    Markup
} = require('telegraf');
const orders = new Scene('orders');

const User = require('../models/User');


orders.enter(async (ctx) => {
    const telegramId = ctx.session.user.telegramUserId;
    const docs = await User.find({
        telegramUserId: telegramId
    }).populate('orders');
    const user = docs[0];
    const orderList = user.orders;
    ctx.reply(
        `${orderList.map((order, index) => `${index+1}. ${order.title}: ${order.isActive?'active':'solved'}\n`)}`,
        Markup.inlineKeyboard([
            Markup.callbackButton('Leave', 'leave')
        ]).extra()
    );
});

orders.action('leave', (ctx) => {
    ctx.editMessageText(`
                i 'm useless`, Extra.HTML().markup(m => m.inlineKeyboard([])));
    return ctx.scene.enter('menu');
})

module.exports = orders;