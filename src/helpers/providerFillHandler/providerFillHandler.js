const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const providerFillHandler = new Composer();

providerFillHandler.action(/fill (.+)/i, ctx => {
  ctx.reply(ctx.match[1]);
});

module.exports = providerFillHandler;
