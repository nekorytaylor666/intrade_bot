const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const Order = require('../../models/Order');

const adminGroupHandler = new Composer();

adminGroupHandler.action(/check (.+)/i, async ctx => {
  //все айдишники групп в телеграме начинаются с минуса поэтому нужно его добавлять здесь
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
  try {
    const order = await Order.findById(orderId).populate('customer');
    order.isActive = true;
    order.status = 'Public';
    await order.save();

    const telegramId = order.customer.telegramUserId;
    ctx.telegram.sendMessage(
      telegramId,
      `Заказ на "${order.description}"\nБыл подтвержден администратором.`,
    );
    ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [
          Markup.callbackButton(
            `Подтверджен ${approveAdmin}`,
            `cancel ${orderId}`,
          ),
          Markup.callbackButton(
            `Отправить в общий канал`,
            `send ${orderId}`,
          ),
        ],
      ],
    });
  } catch (error) {
    console.log(error);
  }
});

adminGroupHandler.action(/cancel (.+)/i, async ctx => {
  //все айдишники групп в телеграме начинаются с минуса поэтому нужно его добавлять здесь
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
  try {
    const order = await Order.findById(orderId).populate('customer');
    order.isActive = false;
    await order.save();
    const telegramId = order.customer.telegramUserId;
    ctx.telegram.sendMessage(
      telegramId,
      `Заказ на "${order.description}"\nБыл отменен администратором.`,
    );
    ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [
          Markup.callbackButton(
            `Отменено ${approveAdmin}`,
            `check ${orderId}`,
          ),
        ],
      ],
    });
  } catch (error) {
    console.log(error);
  }
});

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
                text: 'Откликнуться',
                callback_data: `callback ${orderId}`,
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
                text: 'Откликнуться',
                callback_data: `callback ${orderId}`,
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

adminGroupHandler.action(/send (.+)/i, async ctx => {
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];

  const order = await Order.findById(orderId).populate('customer');

  ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        Markup.callbackButton(
          `Отправлено в общий канал ${approveAdmin}`,
          `nothing`,
        ),
      ],
    ],
  });

  const message = `Описание заказа: ${order.description}\nИмя: ${order.customer.firstName}\nКомпания: ${order.customer.companyName}`;
  const officialChannelId = -process.env.OFFICIAL_CHANNEL_CHAT_ID;

  if (order.fileId) {
    const botMessage = await sendFileWithCaption(
      ctx,
      officialChannelId,
      order.fileId,
      order.docType,
      message,
      orderId,
    );
    order.channelMsgId = botMessage.message_id;
    await order.save();
  }
  if (!order.fileId) {
    const botMessage = await ctx.telegram.sendMessage(
      officialChannelId,
      message,
      Markup.inlineKeyboard(
        [
          Markup.callbackButton(
            `Откликнуться`,
            `callback ${orderId}`,
          ),
        ],
        {
          columns: 1,
        },
      ).extra(),
    );
    order.channelMsgId = botMessage.message_id;
    await order.save();
  }
});
module.exports = adminGroupHandler;
