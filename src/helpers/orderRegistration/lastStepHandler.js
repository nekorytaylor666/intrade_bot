const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const Order = require('../../models/Order');
const User = require('../../models/User');
const { Extra } = require('telegraf');

const lastStep = new Composer();

const sendToAdminGroup = async ctx => {
  const description = ctx.scene.session.description;
  const adminGroupId = -process.env.ADMIN_GROUP_CHAT_ID;
  const cities = ctx.scene.session.cities;
  const customer = ctx.session.user;
  const message = `
Описание:
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
E-mail: ${customer.email ? customer.email : 'не заполнено'}`;

  if (ctx.scene.session.fileId) {
    const docType = ctx.scene.session.docType;
    const fileId = ctx.scene.session.fileId;
    switch (docType) {
      case 'doc':
        return await ctx.telegram.sendDocument(adminGroupId, fileId, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Все верно',
                  callback_data: `check ${ctx.session.savedOrder._id}`,
                  hide: true,
                },
              ],
            ],
          },
          caption: message,
        });
        break;
      case 'photo':
        return await ctx.telegram.sendPhoto(adminGroupId, fileId, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Все верно',
                  callback_data: `check ${ctx.session.savedOrder._id}`,
                  hide: true,
                },
              ],
            ],
          },
          caption: message,
        });
      default:
        break;
    }
  }

  await ctx.telegram.sendMessage(
    adminGroupId,
    message,
    Markup.inlineKeyboard(
      [
        Markup.callbackButton(
          'Все верно',
          `check ${ctx.session.savedOrder._id}`,
        ),
      ],
      {
        columns: 1,
      },
    ).extra(),
  );
};

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
    const savedOrder = await newOrder.save();
    ctx.session.savedOrder = savedOrder;
  } catch (error) {
    console.log(error);
  }
  await sendToAdminGroup(ctx);
  await ctx.reply('Отлично!', Extra.markup(Markup.removeKeyboard()));
  ctx.reply(
    `Твой заказ проходит модерацию! Обычно модерация занимает пару часов. 
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
