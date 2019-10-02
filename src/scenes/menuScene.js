/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const menuScene = new Scene('menu');

const checkUserForOutDatingOrders = require('../helpers/activeOrdersChecker');

menuScene.action('neworder', (ctx) => {
    ctx.editMessageText('This bot hepls you find new providers or buy something.', Extra.HTML().markup(m => m.inlineKeyboard([])));
    ctx.scene.enter('orderRegistration');
});

menuScene.action('orderlist', (ctx) => {
    ctx.editMessageText('This bot hepls you find new providers or buy something.', Extra.HTML().markup(m => m.inlineKeyboard([])));
    ctx.scene.enter('orders');
});

//menu scene enter
menuScene.enter(async (ctx) => {
    if (typeof ctx.session.user === 'undefined') {
        return ctx.scene.enter('auth');
    }
    return ctx.reply('This bot hepls you find new providers or buy something.', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Create new order', 'neworder'),
            m.callbackButton('My orders', 'orderlist')
        ])));
});


menuScene.command('test', () => {
    checkUserForOutDatingOrders();
});


module.exports = menuScene;