const Composer = require('telegraf/composer');
const providerFillHandler = new Composer();
const ProviderRequest = require('../../models/ProviderRequest');

providerFillHandler.action(/fill (.+)/i, async ctx => {
  const providerRequestId = ctx.match[1];
  const providerRequest = await ProviderRequest.findById(
    providerRequestId,
  );
  if (!providerRequest.isSended) {
    ctx.answerCbQuery(`Выполните все шаги для отправки заявки`);
    ctx.session.providerRequestId = providerRequestId;
    ctx.scene.enter('providerFillScene');
  }
  if (providerRequest.isSended) {
    ctx.answerCbQuery(`Вы уже отправили запрос`);
  }
});

module.exports = providerFillHandler;
