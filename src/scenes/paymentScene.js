const Scene = require('telegraf/scenes/base');
const User = require('../models/User');
const PaymentRequest = require('../models/PaymentRequest');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const bcrypt = require('bcrypt');

const paymentScene = new Scene('payments');
const checkTransaction = require('../tools/qiwiApi');

paymentScene.enter(async ctx => {
  const userId = ctx.session.user._id;
  const user = await User.findById(userId);
  ctx.scene.session.user = user;
  if (!user.balance) {
    user.balance = 0;
    await user.save();
  }
  return ctx.reply(
    `Ваш баланс: ${user.balance}`,
    Markup.keyboard([
      ['Пополнить счет'],
      ['Мои платежи'],
      ['⬅️ Главное меню'],
    ])
      .resize()
      .extra(),
  );
});

paymentScene.command('leave', ctx => {
  ctx.scene.leave();
  ctx.scene.enter('menu');
});

paymentScene.hears('Мои платежи', async ctx => {
  const user = ctx.scene.session.user;
  const payments = await PaymentRequest.find({
    customer: user._id,
    status: 'COMPLETED',
  });
  let message = '';
  payments.map((transaction, index) => {
    message += `${index + 1}. Сумма: ${transaction.amount} тг.\n`;
  });
  ctx.reply(message);
});

paymentScene.hears('⬅️ Главное меню', ctx => {
  ctx.scene.enter('menu');
});

const createHash = async user => {
  const roundNumber = 2;
  const salt = await bcrypt.genSalt(roundNumber);
  const hash = await bcrypt.hash(user.telegramUserId, salt);
  return hash;
};

paymentScene.hears('Пополнить счет', async ctx => {
  const user = ctx.scene.session.user;
  let transactionHash = '';
  let payReq = '';
  const wallet = process.env.QIWI_WALLET;

  const RequestExistsOnUser = await PaymentRequest.exists({
    customer: user._id,
    status: 'WAITING',
  });
  if (RequestExistsOnUser) {
    payReq = await PaymentRequest.findOne({
      customer: user.id,
      status: 'WAITING',
    }).lean();
    transactionHash = payReq.transactionHash;
  }
  if (!RequestExistsOnUser) {
    transactionHash = await createHash(user);
    payReq = await new PaymentRequest({
      customer: user._id,
      transactionHash: transactionHash,
      status: 'WAITING',
    });
    await payReq.save();
  }

  ctx.reply(
    `Для пополнения баланса вам нужно \nперечислить средства на QIWI-кошелек: +${wallet}\nВАЖНО! Комментарий к переводу должен быть: \n\n${transactionHash}\n\nВ противном случае ваш перевод не будет обработан. \nОтправлять в тенге.`,
    Markup.inlineKeyboard(
      [
        Markup.urlButton(`Сайт Qiwi.com`, `https://qiwi.com`),
        Markup.callbackButton(
          'Проверить платеж',
          `check ${payReq._id}`,
        ),
      ],
      {
        columns: 1,
      },
    ).extra(),
  );
});

paymentScene.action(/check (.+)/i, async ctx => {
  const paymentRequestId = ctx.match[1];
  let res = '';
  const paymentRequest = await PaymentRequest.findById(
    paymentRequestId,
  ).populate('customer');
  const user = await User.findById(paymentRequest.customer._id);
  if (process.env.DEBUG === 'TRUE') {
    res = await checkTransaction('ПРОГЕР', '77024706259');
  } else {
    res = await checkTransaction(
      paymentRequest.transactionHash,
      paymentRequest.customer.phoneNumber,
    );
  }
  if (res) {
    ctx.answerCbQuery(`баланс пополнен на ${res} тенге!`);
    ctx.deleteMessage();
    user.balance += res;
    await user.save();
    paymentRequest.status = 'COMPLETED';
    paymentRequest.amount = res;
    paymentRequest.date = Date.now();
    await paymentRequest.save();
    return ctx.reply('Текущий баланс: ' + user.balance);
  } else {
    ctx.answerCbQuery(`Ваш платеж еще обрабатывается!`);
    return ctx.reply(
      'Попробуйте проверить платеж позже или обратитесь к администраторам.',
    );
  }
});

paymentScene.use(ctx => {
  ctx.reply('Используйте меню.');
});

module.exports = paymentScene;
