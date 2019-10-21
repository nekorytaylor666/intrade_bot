const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const basicHandler = new Composer();

basicHandler.command('start', ctx => {
  const chatType = ctx.message.chat.type;
  if (chatType === 'private') {
    return ctx.scene.enter('auth');
  }
  if (chatType === 'group') {
    //TODO get rid of this shit.
    ctx.reply(`i'm alive!`);
  }
});
basicHandler.on('callback_query', ctx => {
  if (!ctx.user) {
    ctx.answerCbQuery(
      'Невозможно обработать для неавторизанного пользователя',
    );
    ctx.reply(
      'Для продолжения работы запустите бота командой /start',
      Markup.keyboard([['/start']])
        .oneTime()
        .resize()
        .extra(),
    );
  }
  if (ctx.user) {
    ctx.answerCbQuery(
      'Невозможно обработать данную команду для данного контекста',
    );
  }
});

basicHandler.use(ctx => {
  if (ctx.message) {
    const chatType = ctx.message.chat.type;

    if (chatType === 'group') {
      return ctx.reply(`I cant't handle this command`);
    }
    ctx.reply(
      'Для продолжения работы запустите бота командой /start',
      Markup.keyboard([['/start']])
        .oneTime()
        .resize()
        .extra(),
    );
  }
});

module.exports = basicHandler;
