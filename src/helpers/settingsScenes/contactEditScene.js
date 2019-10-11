/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const User = require('../../models/User');

const contactEditHandler = require('./contactEditHandler');

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const contactEdit = new WizardScene(
  'contactEdit',
  ctx => {
    const user = ctx.session.user;

    ctx.reply(
      ` Твои контакты 
      для связи:
      Имя: ${user.firstName ? user.firstName : 'не заполнено'}
      Компания: ${
        user.companyName ? user.companyName : 'не заполнено'
      }
      Телефон: ${user.phoneNumber ? user.phoneNumber : 'не заполнено'}
      E-mail: ${user.email ? user.email : 'не заполнено'}
      
      По умолчанию берутся данные вашего телеграмм профиля.`,
      Markup.keyboard([
        ['Имя'], // Row1 with 2 buttons
        ['Название компании'], // Row2 with 2 buttons
        ['Почта', 'Телефон'], // Row3 with 3 buttons
        ['⬅️ Главное меню'], // Row3 with 3 buttons
      ])
        .oneTime()
        .resize()
        .extra(),
    );
    return ctx.wizard.next();
  },
  contactEditHandler,
  async ctx => {
    const newValue = ctx.message.text;
    const inputType = ctx.scene.session.inputType;
    switch (inputType) {
      case 'NAME':
        await User.updateOne(
          {
            telegramUserId: ctx.session.user.telegramUserId,
          },
          { firstName: newValue },
        );
        ctx.session.user.firstName = newValue;
        await ctx.reply(`Имя изменено на ${newValue}`);
        break;
      case 'COMPANY':
        await User.updateOne(
          {
            telegramUserId: ctx.session.user.telegramUserId,
          },
          { companyName: newValue },
        );
        ctx.session.user.companyName = newValue;

        await ctx.reply(`Название компании изменено на ${newValue}`);
        break;
      case 'EMAIL':
        if (!validateEmail(newValue)) {
          return ctx.reply('Введите валидный email');
        }
        await User.updateOne(
          {
            telegramUserId: ctx.session.user.telegramUserId,
          },
          { email: newValue },
        );
        ctx.session.user.email = newValue;

        await ctx.reply(`Email изменен на ${newValue}`);
        break;
      case 'PHONE_NUMBER':
        await User.updateOne(
          {
            telegramUserId: ctx.session.user.telegramUserId,
          },
          { phoneNumber: newValue },
        );
        ctx.session.user.phoneNumber = newValue;

        await ctx.reply(`Номер изменен на ${newValue}`);
        break;
    }
    return ctx.scene.enter('contactEdit');
  },
);

contactEdit.hears('⬅️ Главное меню', ctx => {
  ctx.scene.leave();
  ctx.scene.enter('menu');
});

module.exports = contactEdit;
