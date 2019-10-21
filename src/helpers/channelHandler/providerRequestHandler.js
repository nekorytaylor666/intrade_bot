const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const User = require('../../models/User');
const Order = require('../../models/Order');
const ProviderRequest = require('../../models/ProviderRequest');

const providerRequestHandler = new Composer();

const sendFileWithCaption = async (
  ctx,
  channelId,
  fileId,
  docType,
  message,
  orderId,
) => {
  switch (docType) {
    case 'doc':
      return await ctx.telegram.sendDocument(channelId, fileId, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Заполнить заявку',
                callback_data: `fill ${orderId}`,
                hide: false,
              },
            ],
          ],
        },
        caption: message,
      });
      break;
    case 'photo':
      return await ctx.telegram.sendPhoto(channelId, fileId, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Заполнить заявку',
                callback_data: `fill ${orderId}`,
                hide: false,
              },
            ],
          ],
        },
        caption: message,
      });
    default:
      break;
  }
};

providerRequestHandler.action(/callback (.+)/i, async ctx => {
  const orderId = ctx.match[1];
  const userTelegramId = ctx.callbackQuery.from.id;
  const docs = await User.find({
    telegramUserId: userTelegramId,
  });
  const user = docs[0];
  const order = await Order.findById(orderId).populate('customer');
  const isSameUser = user.id === order.customer.id;
  const requestExists = await ProviderRequest.exists({
    provider: user.id,
    order: orderId,
  });

  if (!process.env.DEBUG) {
    if (requestExists) {
      return ctx.answerCbQuery(
        `Вы уже отправляли запрос на этот заказ.`,
      );
    }
    if (isSameUser) {
      return ctx.answerCbQuery(
        `Вы не можете отправлять запрос на исполнение на свой же заказ.`,
      );
    }
  }

  const providerRequest = new ProviderRequest({
    provider: user.id,
    order: orderId,
  });
  await providerRequest.save();
  order.callbackClicks++;
  await order.save();
  ctx.answerCbQuery(
    `Перейдите в приватный чат с ботом для продолжения заполнения заявки на исполнение.`,
  );
  const message = `${order.description}\nДля получения прямых контактов заказчика, вам предварительно нужно описать условия исполнения заказа. Нажмите на кнопку для получения указаний.`;

  if (order.fileId) {
    sendFileWithCaption(
      ctx,
      userTelegramId,
      order.fileId,
      order.docType,
      message,
      orderId,
    );
  }
  if (!order.fileId) {
    ctx.telegram.sendMessage(
      userTelegramId,
      message,
      Markup.inlineKeyboard(
        [
          Markup.callbackButton(
            `Заполнить заявку`,
            `fill ${providerRequest.id}`,
          ),
        ],
        {
          columns: 1,
        },
      ).extra(),
    );
  }
});

module.exports = providerRequestHandler;
