const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const User = require('../../models/User');

const contactHandler = new Composer();

contactHandler.hears('Имя', ctx => {
  ctx.reply('Введите ваше имя!', Markup.removeKeyboard().extra());
  ctx.scene.session.inputType = 'NAME';
  ctx.wizard.next();
});
contactHandler.hears('Название компании', ctx => {
  ctx.reply(
    'Введите название вашей компании!',
    Markup.removeKeyboard().extra(),
  );
  ctx.scene.session.inputType = 'COMPANY';
  ctx.wizard.next();
});
contactHandler.hears('Почта', ctx => {
  ctx.reply('Введите ваш email!', Markup.removeKeyboard().extra());
  ctx.scene.session.inputType = 'EMAIL';
  ctx.wizard.next();
});
contactHandler.hears('Телефон', ctx => {
  ctx.reply(
    'Введите ваш номер телефона!',
    Markup.removeKeyboard().extra(),
  );
  ctx.scene.session.inputType = 'PHONE_NUMBER';
  ctx.wizard.next();
});
contactHandler.use(ctx => ctx.reply('Используйте меню.'));

module.exports = contactHandler;
