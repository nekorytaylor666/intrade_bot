/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Order = require('../../src/models/Order');

const deeplinkHandler = new Composer();

deeplinkHandler.command('start', async ctx => {
  const chatType = ctx.message.chat.type;
  if (chatType === 'private') {
    const orderId = ctx.message.text.split(/ +/)[1];
    const order = await Order.findById(orderId).populate('customer');
    const {
      firstName,
      companyName,
      phoneNumber,
      email,
    } = order.customer;
    ctx.reply(`${order.description}\n
контакты для связи:
Имя: ${firstName ? firstName : 'не заполнено'}
Компания: ${companyName ? companyName : 'не заполнено'}
Телефон: ${phoneNumber ? phoneNumber : 'не заполнено'}
E-mail: ${email ? email : 'не заполнено'}
    `);
  }
  if (chatType === 'group') {
    //TODO get rid of this shit.
    ctx.reply(`Данный бот не для использования в группах!`);
  }
});

module.exports = deeplinkHandler;
