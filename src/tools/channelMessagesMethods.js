const Order = require('../models/Order');
const Markup = require('telegraf/markup');

const sendFileWithCaption = async (
  ctx,
  channelId,
  caption,
  orderId,
) => {
  const order = await Order.findById(orderId);
  const docType = order.docType;
  const fileId = order.fileId;
  switch (docType) {
    case 'doc':
      return await ctx.telegram.sendDocument(channelId, fileId, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Откликнуться - 100тг',
                callback_data: `callback ${orderId}`,
                hide: false,
              },
            ],
          ],
        },
        caption: caption,
      });
      break;
    case 'photo':
      return await ctx.telegram.sendPhoto(channelId, fileId, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Откликнуться - 100тг',
                callback_data: `callback ${orderId}`,
                hide: false,
              },
            ],
          ],
        },
        caption: caption,
      });
    default:
      break;
  }
};

const sendOrderToChannel = async (ctx, orderId) => {
  const order = await Order.findById(orderId).populate('customer');
  order.status = 'Public';
  const message = `Описание заказа: ${order.description}\nИмя: ${order.customer.firstName}\nКомпания: ${order.customer.companyName}`;
  const officialChannelId = -process.env.OFFICIAL_CHANNEL_CHAT_ID;
  let botMessage = '';
  if (order.fileId) {
    botMessage = await sendFileWithCaption(
      ctx,
      officialChannelId,
      message,
      orderId,
    );
  }
  if (!order.fileId) {
    botMessage = await ctx.telegram.sendMessage(
      officialChannelId,
      message,
      Markup.inlineKeyboard(
        [
          Markup.callbackButton(
            `Откликнуться - 100тг`,
            `callback ${orderId}`,
          ),
        ],
        {
          columns: 1,
        },
      ).extra(),
    );
  }

  order.channelMsgId = botMessage.message_id;
  await order.save();
};

const deleteMessageFromChannel = (order, ctx) => {
  const msgId = order.channelMsgId;
  const channelId = -process.env.OFFICIAL_CHANNEL_CHAT_ID;
  try {
    return ctx.telegram.deleteMessage(channelId, msgId);
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { sendOrderToChannel, deleteMessageFromChannel };
