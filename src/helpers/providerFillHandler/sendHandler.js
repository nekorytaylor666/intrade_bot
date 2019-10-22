const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const ProviderRequest = require('../../models/ProviderRequest');
const Order = require('../../models/Order');
const sendHandler = new Composer();

sendHandler.hears('Отмена', ctx => {
  ctx.reply('Вы отменили вашу заявку');
  ctx.leave();
  return ctx.scene.enter('menu');
});

sendHandler.on('text', async ctx => {
  const photos = ctx.scene.session.photos
    ? ctx.scene.session.photos
    : [];
  const docs = ctx.scene.session.docs ? ctx.scene.session.docs : [];
  const providerRequestId = ctx.session.providerRequestId;
  try {
    const providerRequest = await ProviderRequest.findById(
      providerRequestId,
    ).populate('provider');

    const order = await Order.findById(
      providerRequest.order._id,
    ).populate('customer');
    const provider = providerRequest.provider;
    const customerTelegramId = order.customer.telegramUserId;

    if (photos.length > 0) {
      await ctx.telegram.sendMediaGroup(customerTelegramId, photos);
    }
    if (docs.length > 0) {
      await docs.forEach(async doc => {
        ctx.telegram.sendDocument(customerTelegramId, doc.media);
      });
    }
    await ctx.telegram.sendMessage(
      customerTelegramId,
      `Заявка на исполнение от @${provider.telegramUsername}:\n${ctx.scene.session.description}`,
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

    providerRequest.isSended = true;
    await providerRequest.save();
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
