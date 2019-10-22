const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const descHandler = new Composer();

descHandler.on('text', ctx => {
  ctx.scene.session.description = ctx.message.text;
  ctx.reply(
    'Прикрепите фото/видео/документы если таковые имеются как на рисунки ниже',
    Markup.removeKeyboard().extra(),
  );
  ctx.replyWithPhoto(
    {
      source: 'src/static/fileadd.jpg',
    },
    Markup.inlineKeyboard([
      Markup.callbackButton('Пропустить шаг', 'next'),
    ]).extra(),
  );
  return ctx.wizard.next();
});

descHandler.use(ctx => {
  ctx.reply('Отравьте валидный текст сообщения.');
});

module.exports = descHandler;
