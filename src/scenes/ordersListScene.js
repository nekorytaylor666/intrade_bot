/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const {
    Extra,
    Markup
} = require('telegraf');
const orderListScene = new Scene('orderList');

const User = require('../models/User');


orderListScene.enter(async (ctx) => {
    const telegramId = ctx.session.user.telegramUserId;
    const docs = await User.find({
        telegramUserId: telegramId
    }).populate('orders');
    const user = docs[0];
    const orderList = user.orders;
    ctx.reply(
        `${orderList.map((order, index) => `${index+1}. ${order.description}: ${order.isActive?'active':'solved'}\n`)}`,
        Markup.inlineKeyboard([
            Markup.callbackButton('Leave', 'leave')
        ]).extra()
    );
    ctx.session.orders = orderList;
});

orderListScene.action('leave', (ctx) => {
    const orderList = ctx.session.orders;
    ctx.editMessageText(`${orderList.map((order, index) => `${index+1}. ${order.description}: ${order.isActive?'active':'solved'}\n`)}`, Extra.HTML().markup(m => m.inlineKeyboard([])));
    return ctx.scene.enter('orders');
})

module.exports = orderListScene;