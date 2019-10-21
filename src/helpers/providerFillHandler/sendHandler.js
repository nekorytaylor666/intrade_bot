const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const ProviderRequest = require('../../models/ProviderRequest');
const sendHandler = new Composer();

sendHandler.hears('Отмена', ctx => {
  ctx.reply('Вы отменили вашу заявку');
  ctx.leave();
  return ctx.scene.enter('menu');
});

sendHandler.on('text', async ctx => {
  const photos = ctx.scene.session.photos;
  const docs = ctx.scene.session.docs;
  const providerRequestId = ctx.session.providerRequestId;
  try {
    const providerRequest = await ProviderRequest.findById(
      providerRequestId,
    )
      .populate('order')
      .populate('provider');

    const customerTelegramId =
      providerRequest.provider.telegramUserId;

    if (photos) {
      await ctx.telegram.sendMediaGroup(customerTelegramId, photos);
      await ctx.telegram.sendMessage(
        customerTelegramId,
        ctx.scene.session.description,
        Markup.inlineKeyboard(
          [
            Markup.callbackButton(
              `Одобрить`,
              `accept ${providerRequestId}`,
            ),
          ],
          {
            columns: 1,
          },
        ).extra(),
      );
    }
  } catch (error) {
    ctx.reply(`Обратитесь к @akmt_dev c кодом ошибки: ${error}`);
  }

  ctx.reply(
    `Ваша заявка отправлена заказчику, с вами свяжутся напрямую.`,
  );
  ctx.scene.leave();
  return ctx.scene.enter('menu');
});

sendHandler.use(ctx => {
  ctx.reply('Отравьте валидный текст сообщения.');
});

module.exports = sendHandler;
