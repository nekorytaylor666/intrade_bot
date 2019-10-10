/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const Order = require('../../models/Order');
const User = require('../../models/User');

const lastStep = new Composer();

lastStep.hears('Далее', async ctx => {
  const { description, cities } = ctx.scene.session;
  const customer = ctx.session.user;
  const fileId = ctx.scene.session.fileId
    ? ctx.scene.session.fileId
    : null;
  const docType = ctx.scene.session.docType
    ? ctx.scene.session.docType
    : null;
  const telegramId = customer.telegramUserId;
  try {
    //изменить структуры запроса для вложенных схем
    const docs = await User.find({
      telegramUserId: telegramId,
    }).exec();
    const user = docs[0];
    const newOrder = new Order({
      description: description,
      customer: user._id,
      cities: cities,
      docType: docType,
      fileId: fileId,
    });
    user.orders.push(newOrder.id);
    await user.save();
    await newOrder.save();
  } catch (error) {
    console.log(error);
  }
  ctx.reply(
    `Отлично!
    Твой заказ проходит модерацию! Обычно модерация занимает пару часов. 
    Вам придет уведомление как только модератор пропустит заказ.`,
    Markup.inlineKeyboard(
      [
        Markup.callbackButton('Предпросмотр заказа', 'preview'),
        Markup.callbackButton('В главное меню', 'menu'),
      ],
      {
        columns: 1,
      },
    ).extra(),
  );
});

lastStep.action('preview', async ctx => {
  const description = ctx.scene.session.description;

  const cities = ctx.scene.session.cities;
  const customer = ctx.session.user;
  await ctx.reply(
    `Описание:
    ${description}
    
    В городе(-ах): ${cities.map(city => `${city}`)}
    
    Контакты для связи:
    Имя: ${customer.firstName ? customer.firstName : 'не заполнено'}
    Компания: ${
      customer.companyName ? customer.companyName : 'не заполнено'
    }
    Телефон: ${
      customer.phoneNumber ? customer.phoneNumber : 'не заполнено'
    }
    E-mail: ${customer.email ? customer.email : 'не заполнено'}`,
    Markup.inlineKeyboard(
      [Markup.callbackButton('В главное меню', 'menu')],
      {
        columns: 1,
      },
    ).extra(),
  );

  if (ctx.scene.session.fileId) {
    const docType = ctx.scene.session.docType;
    const fileId = ctx.scene.session.fileId;
    switch (docType) {
      case 'doc':
        await ctx.replyWithDocument(fileId);
        break;
      case 'photo':
        await ctx.replyWithPhoto(fileId);
      default:
        break;
    }
  }
});

lastStep.action('menu', async ctx => {
  ctx.scene.leave();
  ctx.scene.enter('menu');
});
module.exports = lastStep;
