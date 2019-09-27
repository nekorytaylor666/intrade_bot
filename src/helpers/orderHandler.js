/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');

const orderHandler = new Composer();

const retrieveValue = (ignoreString, str) => {
    const pattern1 = '(?!';
    const pattern2 = ')\\b(?![\\s])(.*)';

    const regex = new RegExp(pattern1 + ignoreString + pattern2, 'gi');

    // const regex = /(?!title)\b(?![\s])(.*)/gm;
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
// } else {
// 	ctx.reply(
// 		`please input valid title
// 		example: /title my awesome title`);
// }

// Reenter currenst scene


orderHandler.command('description', (ctx) => {
    //remove /title from message and retrieve only title with regular expression
    const str = ctx.message.text;
    const description = retrieveValue('description', str);
    if (description) {
        ctx.session.description = description;
        return ctx.scene.reenter();
    } else {
        ctx.reply(
            `please input valid description\nexample: /description my awesome description`
        );
    }
    // Reenter currenst scene
});


orderHandler.command('buy', (ctx) => {
    ctx.reply('buy buy!');
    ctx.scene.leave();
});


module.exports = orderHandler;