const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

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

const sendHandler = require('../helpers/providerFillHandler/sendHandler');

const providerFillScene = new WizardScene(
  'providerFillScene',
  ctx => {
    ctx.reply(
      'Опишите как, в какие сроки и за какую цену вы готовы выполнить заказ.',
      Markup.removeKeyboard().extra(),
    );
    ctx.wizard.next();
  },
  descHandler,
  mediaHandler,
  sendHandler,
);

module.exports = providerFillScene;
