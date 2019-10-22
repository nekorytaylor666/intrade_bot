const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const mediaHandler = new Composer();

mediaHandler.action('next', ctx => {
  ctx.answerCbQuery(`Вы пропустили прикрепление файла`);
  ctx.editMessageCaption(
    'Вы пропустили этап приклепления документов.',
    Markup.inlineKeyboard([]).extra(),
  );
  ctx.reply(
    'Нажмите кнопку "Далее", чтобы перейти к следующему этапу.',
    Markup.keyboard([['Далее']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});

mediaHandler.on('document', ctx => {
  if (!ctx.scene.session.files) {
    ctx.scene.session.files = [];
  }
  ctx.scene.session.files.push({
    media: ctx.message.document.file_id,
    type: 'doc',
  });
  ctx.reply(
    'Мы сохранили ваш документ! Теперь нажмите "Далее", чтобы закончить прикрепление документов, либо "Отмена", чтобы переотправить документы.',
    Markup.keyboard([['Подтвердить'], ['Отмена']])
      .oneTime()
      .resize()
      .extra(),
  );
});

mediaHandler.hears('Подтвердить', ctx => {
  ctx.reply(`${ctx.scene.session.description}`);
  const files = ctx.scene.session.files;
  const photos = files.filter(file => file.type === 'photo');
  const docs = files.filter(file => file.type === 'doc');

  ctx.scene.session.photos = photos;
  ctx.scene.session.docs = docs;

  if (photos) {
    ctx.replyWithMediaGroup(JSON.stringify(photos), {
      caption: 'lol',
    });
  }
  if (docs) {
    docs.forEach(doc => ctx.replyWithDocument(doc.media));
  }
  ctx.reply(
    'Отправить запрос?',
    Markup.keyboard([['Отправить заявку'], ['Отмена']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});

mediaHandler.hears('Отмена', ctx => {
  ctx.reply('Вы отменили ваш запрос');
  ctx.scene.leave();
  return ctx.scene.enter('menu');
});

mediaHandler.on('photo', ctx => {
  if (!ctx.scene.session.files) {
    ctx.scene.session.files = [];
  }
  ctx.scene.session.files.push({
    media: ctx.message.photo[1].file_id,
    type: 'photo',
  });
  ctx.reply(
    'Мы сохранили ваше фото! Теперь нажмите "Далее", чтобы закончить прикрепление документов, либо "Отмена", чтобы переотправить документы.',
    Markup.keyboard([['Подтвердить'], ['Отмена']])
      .oneTime()
      .resize()
      .extra(),
  );
});

mediaHandler.use(ctx =>
  ctx.replyWithMarkdown(
    'Прикрепите фото/видео/документы или пропустите данный этап нажав на кнопку "пропустить"',
  ),
);

module.exports = mediaHandler;
