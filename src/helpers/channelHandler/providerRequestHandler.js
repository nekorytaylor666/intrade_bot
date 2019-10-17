/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const User = require('../../models/User');
const Order = require('../../models/Order');
const ProviderRequest = require('../../models/ProviderRequest');

const providerRequestHandler = new Composer();

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
  if (!requestExists && !isSameUser) {
    const providerRequest = new ProviderRequest({
      provider: user.id,
      order: orderId,
    });
    await providerRequest.save();
    const {
      firstName,
      companyName,
      phoneNumber,
      email,
    } = order.customer;
    ctx.answerCbQuery(
      `Вам отправлены контакты заказчика в вашу приватную переписку с ботом.`,
    );
    ctx.telegram.sendMessage(
      userTelegramId,
      `Заказ:\n${order.description}\n
Контакты для связи:
Имя: ${firstName ? firstName : 'не заполнено'}
Компания: ${companyName ? companyName : 'не заполнено'}
Телефон: ${phoneNumber ? phoneNumber : 'не заполнено'}
E-mail: ${email ? email : 'не заполнено'}`,
    );
  }
});

module.exports = providerRequestHandler;
