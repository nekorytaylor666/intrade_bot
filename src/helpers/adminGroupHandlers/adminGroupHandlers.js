/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const User = require('../../models/User');
const Order = require('../../models/Order');
const { Extra } = require('telegraf');

const adminGroupHandler = new Composer();

adminGroupHandler.action(/check (.+)/i, async ctx => {
  //все айдишники групп в телеграме начинаются с минуса поэтому нужно его добавлять здесь
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
  try {
    const order = await Order.findById(orderId);
    order.isActive = true;
    await order.save();

    ctx.editMessageReplyMarkup({
      inline_keyboard: [
        [
          Markup.callbackButton(
            `Подтверджен ${approveAdmin}`,
            `cancel ${orderId}`,
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
    const order = await Order.findById(orderId);
    order.isActive = false;
    await order.save();

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
module.exports = adminGroupHandler;
