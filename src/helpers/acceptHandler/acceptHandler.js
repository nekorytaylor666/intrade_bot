const Composer = require('telegraf/composer');
const ProviderRequest = require('../../models/ProviderRequest');
const Order = require('../../models/Order');
const Markup = require('telegraf/markup');

const acceptHandler = new Composer();

acceptHandler.action(/accept (.+)/i, async ctx => {
  const providerRequestId = ctx.match[1];
  const providerRequest = await ProviderRequest.findById(
    providerRequestId,
  ).populate('provider');
  providerRequest.confirmed = true;
  const provider = providerRequest.provider;
  const orderId = providerRequest.order._id;
  const order = await Order.findById(orderId).populate('customer');
  const customer = order.customer;
  order.isActive = false;
  order.status = 'Proccesing';
  await order.save();
  await providerRequest.save();

  ctx.answerCbQuery(
    'Вы одобрили заявку поставщика. Его контакты отправлены вам.',
  );
  await ctx.reply(
    `Имя: ${provider.firstName}\nПочта: ${provider.email}\nКомпания: ${provider.companyName}\nТелефон: ${provider.phoneNumber}\nТелеграм: @${provider.telegramUsername}`,
    Markup.inlineKeyboard(
      [
        Markup.urlButton(
          `Телеграм профиль`,
          `https://t.me/${provider.telegramUsername}`,
        ),
      ],
      {
        columns: 1,
      },
    ).extra(),
  );
  await ctx.telegram.sendMessage(
    provider.telegramUserId,
    `Ваша заявка одобрена, для дополнительного обсуждения, можете обратиться к заказчику. 
Контакты:
Имя: ${customer.firstName}\nПочта: ${customer.email}\nКомпания: ${customer.companyName}\nТелефон: ${customer.phoneNumber}\nТелеграм: @${customer.telegramUsername}`,
    Markup.inlineKeyboard(
      [
        Markup.urlButton(
          `Телеграм профиль`,
          `https://t.me/${customer.telegramUsername}`,
        ),
      ],
      {
        columns: 1,
      },
    ).extra(),
  );
});

module.exports = acceptHandler;
