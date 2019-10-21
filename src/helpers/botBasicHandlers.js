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

basicHandler.use(ctx => {
  if (ctx.message) {
    const chatType = ctx.message.chat.type;

    if (chatType === 'group') {
      return ctx.reply(`I cant't handle this command`);
    }
    ctx.reply(
      'Ваша сессия истекла. Прошу перезагрузите бота или введите команду /start',
      Markup.keyboard([['/start']])
        .oneTime()
        .resize()
        .extra(),
    );
  }
});

module.exports = basicHandler;
