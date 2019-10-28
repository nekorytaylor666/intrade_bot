const Scene = require('telegraf/scenes/base');
const { Extra, Markup } = require('telegraf');
const orderListScene = new Scene('orderList');

const User = require('../models/User');
const Order = require('../models/Order');

orderListScene.enter(async ctx => {
  const user = ctx.session.user;
  const orders = await Order.find({ customer: user._id })
    .lean()
    .limit(50);
  let ordersListMsg = '';
  let emojiStatus = '';
  orders.map((order, index) => {
    const { status, description } = order;
    let statusPart = '';
    if (status === 'Moderating') {
      emojiStatus = '👨🏼‍💻';
      statusPart =
        'Закан на модерации. Вам придет уведомление о подтверждении';
    } else if (status === 'Public') {
      emojiStatus = '🔊';
      statusPart = `Опубликован в канале. ✅ Откликов: ${order.callbackClicks}`;
    } else if (status === 'Confirmed') {
      emojiStatus = '🆗';
      statusPart = `Подтвержден администратором. Ожидает публикации в канале.`;
    } else if (status === 'Outdated') {
      emojiStatus = '💤';
      statusPart =
        'Удален из канала. Купите членство для добавления в канал.';
    } else if (status === 'Solved') {
      emojiStatus = '⚒';
      statusPart = 'На выполнении.';
    }

    ordersListMsg = ordersListMsg.concat(
      `${index + 1}: `,
      `${emojiStatus} `,
      description,
      '\n',
      statusPart,
      '\n\n',
    );
  });
  ctx.reply(ordersListMsg);
  return ctx.scene.enter('orders');
});

module.exports = orderListScene;
