const Scene = require('telegraf/scenes/base');
const orderListScene = new Scene('orderList');
const { Markup } = require('telegraf');
const sendOrderToChannel = require('../tools/channelMessagesMethods')
  .sendOrderToChannel;

const User = require('../models/User');
const Order = require('../models/Order');

orderListScene.enter(async ctx => {
  const user = ctx.session.user;
  const orders = await Order.find({ customer: user._id })
    .lean()
    .limit(50);
  ctx.scene.session.orders = orders;
  if (orders.length === 0) {
    ctx.reply('У вас пока нет заказов.');
    return ctx.scene.enter('orders');
  }
  if (orders.length > 0) {
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
        statusPart = `Удален из канала. Введите команду /return ${index +
          1}, чтобы вернуть его в канал.`;
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
    ctx.reply(
      ordersListMsg,
      Markup.keyboard([['⬅️ Заказы']])
        .resize()
        .extra(),
    );
  }
});

orderListScene.hears(/\/return (.*)/, async ctx => {
  const orders = ctx.scene.session.orders;
  if (orders.length > 0) {
    const orderIndex = ctx.match[1] - 1;
    if (orderIndex < 0) {
      return ctx.reply('Такого заказа нет');
    }
    if (orders[orderIndex].status === 'Outdated') {
      const orderId = orders[orderIndex]._id;
      await sendOrderToChannel(ctx, orderId);
      ctx.reply('Заказ снова отправлен в канал');
    }
    return ctx.reply(
      'Эта команда работает только с заказами, которые были удалены из канала.',
    );
  }
});

orderListScene.hears('⬅️ Заказы', ctx => {
  ctx.scene.leave();
  ctx.scene.enter('orders');
});

orderListScene.use(ctx => {
  ctx.reply('Я не поддерживаю такую команду.');
});

module.exports = orderListScene;
