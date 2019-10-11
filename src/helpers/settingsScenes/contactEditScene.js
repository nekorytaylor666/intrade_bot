/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const contactEditHandler = require('./contactEditHandler');

const contactEdit = new Scene('contactEdit');

contactEdit.enter(async ctx => {
  const user = ctx.session.user;

  ctx.reply(
    ` Твои контакты 
    для связи:
    Имя: ${user.firstName ? user.firstName : 'не заполнено'}
    Компания: ${user.companyName ? user.companyName : 'не заполнено'}
    Телефон: ${user.phoneNumber ? user.phoneNumber : 'не заполнено'}
    E-mail: ${user.email ? user.email : 'не заполнено'}
    
    По умолчанию берутся данные вашего телеграмм профиля.
    Если все верно нажми "Все верно". Если хочешь изменить контакты то выбери одну из команд:
    /name (Имя)
    /company (Компания)
    /phone (Телефон
    /email (Почта)`,
    Markup.keyboard([['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
});

contactEdit.hears('Назад', ctx => {
  ctx.scene.enter('settings');
});

contactEdit.use(contactEditHandler);

module.exports = contactEdit;
