/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Order = require('../models/Order');
const User = require('../models/User');
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
    const telegramId = ctx.session.user.telegramUserId;
    console.log(title, description);

    try {
        const docs = await User.find({
            telegramUserId: telegramId
        }).exec();
        const user = docs[0];
        const newOrder = new Order({
            title: title,
            description: description,
            customer: user.id
        });
        user.orders.push(newOrder.id);
        await user.save();
        await newOrder.save();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply(`We saved your order "${ctx.session.title}!"`);
    ctx.session.title = null;
    ctx.session.description = null;
    return ctx.scene.enter('menu');
});

module.exports = saveHandler;