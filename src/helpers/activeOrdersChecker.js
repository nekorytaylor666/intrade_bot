const Telegram = require('telegraf/telegram');
const User = require('../models/User');
const Order = require('../models/Order');

const deleteMessageFromChannel = require('../tools/channelMessagesMethods');

const daysBetween = (first, second) => {
  // Copy date parts of the timestamps, discarding the time parts.
  const one = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate(),
  );
  const two = new Date(
    second.getFullYear(),
    second.getMonth(),
    second.getDate(),
  );

  // Do the math.
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisBetween = two.getTime() - one.getTime();
  const days = millisBetween / millisecondsPerDay;

  // Round down.
  return Math.floor(days);
};

const checkUserForOutDatingOrders = async ctx => {
  //TODO сделать функцию которая будет менять статус найденных ордеров на false
  const telegram = new Telegram(process.env.TELEGRAM_TOKEN);
  //amount of days after order become outdated
  //TODO change this value for something more reliable
  const outDateAmount = 7;
  const cursor = User.find({
    isPremium: false,
  })
    .populate('orders')
    .lean()
    .cursor();

  cursor
    .eachAsync(async user => {
      const orders = await Order.find({ customer: user._id });
      const outDatedOrders = [];
      //check every order of user if its outdated then make list from it
      orders.map(order => {
        if (order.status !== 'Outdated') {
          const orderDate = new Date(order.date);
          const today = new Date();
          const dayGap = daysBetween(orderDate, today);
          if (dayGap >= outDateAmount) {
            return outDatedOrders.push(order);
          }
        }
      });
      //TODO change the tg message
      try {
        //if there any outdated orders send notification in telegram
        if (outDatedOrders.length > 0) {
          outDatedOrders.forEach(order => {
            order.status = 'Outdated';
            order.isActive = false;
            // deleteMessageFromChannel(order, ctx);
            order.save();
          });
          await telegram.sendMessage(
            user.telegramUserId,
            `Эти заказы были удалены из канала. Для того, чтобы их вернуть просим вас зайти в ваши заказы и вернуть их:\n${outDatedOrders.map(
              (doc, index) => `${index + 1}.${doc.description}\n`,
            )}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    })
    .then(console.log('Рассылка завершена!'))
    .catch(err => console.log(err));
};

module.exports = checkUserForOutDatingOrders;
