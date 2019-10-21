const Composer = require('telegraf/composer');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const { Extra } = require('telegraf');
const { enter, leave } = Stage;

const documentStepHandler = new Composer();
documentStepHandler.action('next', ctx => {
  ctx.editMessageCaption(
    'Вы пропустили этап приклепления документов.',
    Extra.HTML().markup(m => m.inlineKeyboard([])),
  );
  ctx.reply(
    'Нажмите кнопку "Далее", чтобы перейти к следующему этапу или "Назад", чтобы прикрепить документ.',
    Markup.keyboard([['Далее'], ['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});
documentStepHandler.action('back', ctx => {
  ctx.editMessageCaption(
    `Вы вернулись на этап 1/3`,
    Extra.HTML().markup(m => m.inlineKeyboard([])),
  );
  ctx.wizard.back(); // Set the listener to the previous function
  ctx.wizard.back(); // Set the listener to the previous function
  return ctx.wizard.steps[ctx.wizard.cursor](ctx); // Manually trigger the listener with the current ctx
});

documentStepHandler.on('document', ctx => {
  ctx.scene.session.fileId = ctx.message.document.file_id;
  ctx.scene.session.docType = 'doc';
  ctx.reply(
    'Мы сохранили ваш документ! Теперь нажмите "Далее", чтобы продолжить регистрацию заказа, либо "Назад", чтобы переотправить документ.',
    Markup.keyboard([['Далее'], ['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});

documentStepHandler.on('photo', ctx => {
  ctx.scene.session.fileId = ctx.message.photo[1].file_id;
  ctx.scene.session.docType = 'photo';
  ctx.reply(
    'Мы сохранили ваш документ! Теперь нажмите "Далее", чтобы продолжить регистрацию заказа, либо "Назад", чтобы переотправить документ.',
    Markup.keyboard([['Далее'], ['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});

documentStepHandler.use(ctx =>
  ctx.reply('Нажмите на одну из кнопок или отправьте документ'),
);

module.exports = documentStepHandler;
