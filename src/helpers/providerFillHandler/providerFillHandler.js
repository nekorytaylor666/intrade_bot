const Composer = require('telegraf/composer');
const providerFillHandler = new Composer();

providerFillHandler.action(/fill (.+)/i, ctx => {
  ctx.answerCbQuery(`Выполните все шаги для отправки заявки`);
  ctx.session.providerRequestId = ctx.match[1];
  ctx.scene.enter('providerFillScene');
});

module.exports = providerFillHandler;
