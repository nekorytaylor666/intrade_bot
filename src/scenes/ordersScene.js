/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const orders = new Scene('orders');

const Order = require('../models/Order');


orders.enter(async (ctx) => {
    Order.find({
        'customer.firstName': 'Tokhtar'
    }).exec((data) => {
        console.log(data);
    });

    ctx.reply(
        `This is yours orders: `,
        Markup.inlineKeyboard([
            Markup.callbackButton('Leave', 'leave')
        ]).extra()
    );
});

orders.action('leave', (ctx) => {
    return ctx.scene.enter('menu');
})

module.exports = orders;