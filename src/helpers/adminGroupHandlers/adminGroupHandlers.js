const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const Order = require('../../models/Order');

const sendOrderToChannel = require('../../tools/channelMessagesMethods')
  .sendOrderToChannel;

const adminGroupHandler = new Composer();

adminGroupHandler.action(/check (.+)/i, async ctx => {
  //все айдишники групп в телеграме начинаются с минуса поэтому нужно его добавлять здесь
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
  try {
    const order = await Order.findById(orderId).populate('customer');
    order.isActive = true;
    order.status = 'Confirmed';
    await order.save();

    const telegramId = order.customer.telegramUserId;
    ctx.telegram.sendMessage(
      telegramId,
      `Заказ на "${order.description}"\nБыл подтвержден администратором. Ваш заказ опубликован в официальном канале. https://t.me/intrade_provider`,
      Markup.inlineKeyboard(
        [
          Markup.urlButton(
            `Канал Intrade`,
            `https://t.me/intrade_provider`,
          ),
        ],
        {
          columns: 1,
        },
      ).extra(),
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
    order.status = 'Moderating';
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

adminGroupHandler.action('noting', ctx => {
  ctx.answerCbQuery('Отправлено в общий канал.');
});

adminGroupHandler.action(/send (.+)/i, async ctx => {
  const approveAdmin = ctx.callbackQuery.from.username;
  const orderId = ctx.match[1];
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
  await sendOrderToChannel(ctx, orderId);
});
module.exports = adminGroupHandler;
