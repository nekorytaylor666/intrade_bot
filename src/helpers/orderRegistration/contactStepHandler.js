const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const User = require('../../models/User');
const { Extra } = require('telegraf');

const contactHandler = new Composer();

function createMessage(name, company, phoneNumber, email) {
  return `Этап 4/5
    Последний шаг!
    
    Твои контакты 
    для связи:
    Имя: ${name ? name : 'не заполнено'}
    Компания: ${company ? company : 'не заполнено'}
    Телефон: ${phoneNumber ? phoneNumber : 'не заполнено'}
    E-mail: ${email ? email : 'не заполнено'}
    
    По умолчанию берутся данные из настроек профиля.
    Если все верно нажми "Все верно". Если хочешь изменить контакты то выбери одну из команд:
    /name (Имя)
    /company (Компания)
    /phone (Телефон
    /email (Почта)`;
}

contactHandler.hears('Далее', ctx => {
  const user = ctx.session.user;
  return ctx.reply(
    createMessage(
      user.firstName,
      user.companyName,
      user.phoneNumber,
      user.email,
    ),
    Markup.inlineKeyboard(
      [Markup.callbackButton('Все верно', 'check')],
      {
        columns: 1,
      },
    ).extra(),
  );
});

contactHandler.hears('Назад', ctx => {
  ctx.wizard.back();
  ctx.wizard.back();
  ctx.wizard.back();
  return ctx.wizard.steps[1](ctx);
});

contactHandler.action('check', async ctx => {
  const user = ctx.session.user;

  const updatedUser = new User({
    _id: user._id,
    phoneNumber: user.phoneNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    telegramUserId: user.telegramUserId,
    isPremium: false,
    email: user.email,
    companyName: user.companyName,
    balance: user.balance,
  });
  try {
    await User.updateOne(
      {
        telegramUserId: user.telegramUserId,
      },
      updatedUser,
    );
    ctx.session.user = updatedUser;
  } catch (error) {
    console.log(error);
  }
  ctx.editMessageText(
    createMessage(
      user.firstName,
      user.companyName,
      user.phoneNumber,
      user.email,
    ),
    Extra.HTML().markup(m => m.inlineKeyboard([])),
  );
  ctx.reply(
    ` Твои контакты 
    для связи:
    Имя: ${user.firstName ? user.firstName : 'не заполнено'}
    Компания: ${user.companyName ? user.companyName : 'не заполнено'}
    Телефон: ${user.phoneNumber ? user.phoneNumber : 'не заполнено'}
    E-mail: ${user.email ? user.email : 'не заполнено'}`,
    Markup.keyboard([['Далее']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});

contactHandler.hears(/name (.+)/i, ctx => {
  ctx.session.user.firstName = ctx.match[1];
  const user = ctx.session.user;
  ctx.reply(
    createMessage(
      user.firstName,
      user.companyName,
      user.phoneNumber,
      user.email,
    ),
    Markup.inlineKeyboard(
      [Markup.callbackButton('Все верно', 'check')],
      {
        columns: 1,
      },
    ).extra(),
  );
});

contactHandler.hears(/company (.+)/i, ctx => {
  ctx.session.user.companyName = ctx.match[1];
  const user = ctx.session.user;
  ctx.reply(
    createMessage(
      user.firstName,
      user.companyName,
      user.phoneNumber,
      user.email,
    ),
    Markup.inlineKeyboard(
      [Markup.callbackButton('Все верно', 'check')],
      {
        columns: 1,
      },
    ).extra(),
  );
});
contactHandler.hears(/phone (.+)/i, ctx => {
  ctx.session.user.phoneNumber = ctx.match[1];
  const user = ctx.session.user;
  ctx.reply(
    createMessage(
      user.firstName,
      user.companyName,
      user.phoneNumber,
      user.email,
    ),
    Markup.inlineKeyboard(
      [Markup.callbackButton('Все верно', 'check')],
      {
        columns: 1,
      },
    ).extra(),
  );
});

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
contactHandler.hears(/email (.+)/i, ctx => {
  const email = ctx.match[1];
  if (validateEmail(email)) {
    ctx.session.user.email = ctx.match[1];
    const user = ctx.session.user;
    return ctx.reply(
      createMessage(
        user.firstName,
        user.companyName,
        user.phoneNumber,
        user.email,
      ),
      Markup.inlineKeyboard(
        [Markup.callbackButton('Все верно', 'check')],
        {
          columns: 1,
        },
      ).extra(),
    );
  }
  return ctx.reply('Введите действительный почтовый адрес!');
});

contactHandler.use(ctx => {
  ctx.reply(`Пожалуйста, используйте меню.`);
});
module.exports = contactHandler;
