/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');

const orderHandler = new Composer();

const retrieveValue = (ignoreString, str) => {
    const pattern1 = '(?![';
    const pattern2 = '])(?!\\s)[\\w\\u0400-\\u04FF\\s]+';

    // regex = /(?![ignoreString])(?!\s)[\w\u0400-\u04FF\s]+/gm;
    const regex = new RegExp(pattern1 + ignoreString + pattern2, 'gi');

    const match = str.match(regex);
    if (match && match[0] !== "") return match.join('');
    else return null
}

orderHandler.command('title', (ctx) => {
    const str = ctx.message.text;
    const title = retrieveValue('title', str);
    if (title) {
        ctx.session.title = title;
        return ctx.scene.reenter();
    } else {
        ctx.reply(
            `please input valid title\nexample: /title my awesome title`
        );
    }
});

orderHandler.command('description', (ctx) => {
    //remove /title from message and retrieve only title with regular expression
    const str = ctx.message.text;
    console.log(str);
    const description = retrieveValue('description', str);
    if (description) {
        ctx.session.description = description;
        // Reenter currenst scene
        return ctx.scene.reenter();
    } else {
        ctx.reply(
            `please input valid description\nexample: /description my awesome description`
        );
    }
});


orderHandler.action('cancel', async (ctx) => {
    await ctx.reply(`You've canceled input of order. Your input have been cached!`);
    return ctx.scene.enter('menu');
});


module.exports = orderHandler;