/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Order = require('../models/Order');

const saveHandler = new Composer();

saveHandler.action('save', async (ctx) => {
    if (typeof ctx.session.title === 'undefined') {
        return ctx.reply('please input valid title');
    }
    if (typeof ctx.session.description === 'undefined') {
        return ctx.reply('please input valid description');
    }
    const {
        title,
        description
    } = ctx.session;
    console.log(title, description);
    const newOrder = new Order({
        title: title,
        description: description
    });
    try {
        await newOrder.save();
    } catch (error) {
        console.log(error);
    }
    ctx.reply(`We saved your order "${ctx.session.title}!"`);
    ctx.session = null;
    return ctx.scene.enter('menu');
});

saveHandler.command('save', (ctx) => {
    ctx.reply('We saved your order!');
    return ctx.scene.enter('menu');
});

module.exports = saveHandler;