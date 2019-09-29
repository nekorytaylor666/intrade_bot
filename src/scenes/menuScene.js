/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const {
    Extra,
    Markup
} = require('telegraf');

const menuScene = new Scene('menu');


//menu scene enter
menuScene.enter(async (ctx) => {
    return ctx.reply('This bot hepls you find new providers or buy something.', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Create new order', 'neworder'),
            m.callbackButton('My orders', 'orderlist')
        ])));
});

menuScene.action('neworder', (ctx) => {
    ctx.editMessageText('This bot hepls you find new providers or buy something.', Extra.HTML().markup(m => m.inlineKeyboard([])));
    ctx.scene.enter('orderRegistration');
})



module.exports = menuScene;