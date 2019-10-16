/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const Order = require('../../models/Order');
const turl = require('turl');

const adminGroupHandler = new Composer();

adminGroupHandler.action(/check (.+)/i, async ctx => {
  //все айдишники групп в телеграме начинаются с минуса поэтому нужно его добавлять здесь
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
  try {
    const order = await Order.findById(orderId).populate('customer');
    order.isActive = true;
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

const deepLinkCreator = async orderId => {
  const botProviderUsername = process.env.BOT_PROVIDER_USERNAME;
  const baseUrl = `https://telegram.me/${botProviderUsername}?start=${orderId}`;
  //у телеграмма есть ограничение по url не больше 64 байт. Так что нужно его укорачивать.
  const shortUrl = await turl.shorten(baseUrl);
  return shortUrl;
};

adminGroupHandler.action(/send (.+)/i, async ctx => {
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
  try {
    const order = await Order.findById(orderId).populate('customer');
    order.isActive = false;
    await order.save();
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
    const officialChannelId = -process.env.OFFICIAL_CHANNEL_CHAT_ID;
    const shortUrl = await deepLinkCreator(orderId);
    ctx.telegram.sendMessage(
      officialChannelId,
      `${order.description}\n${order.customer.firstName}\n${order.customer.companyName}`,
      Markup.inlineKeyboard(
        [Markup.urlButton(`Откликнуться`, shortUrl)],
        {
          columns: 1,
        },
      ).extra(),
    );
  } catch (error) {
    console.log(error);
  }
});
module.exports = adminGroupHandler;
