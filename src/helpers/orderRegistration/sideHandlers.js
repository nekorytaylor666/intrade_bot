const Markup = require('telegraf/markup');
const Composer = require('telegraf/composer');

const enterStepFunc = ctx => {
  try {
    ctx.reply(
      `Этап: 1/3
        Опишите что Вам нужно?
        
        Пример: срочно нужны 50 штук видеокамер компании hiwatch, модель B5456, срок поставки до 5 октября, цена до 3000 тенге.
    
        Помните что чем подробнее Вы описали свой заказ, тем охотнее поставщики отклинутся на него.`,

      Markup.removeKeyboard().extra(),
    );
    return ctx.wizard.next();
  } catch (error) {
    console.log(error);
  }
};

const documentEnterStepFunc = async ctx => {
  try {
    ctx.scene.session.description = ctx.message.text;
  } catch (error) {
    ctx.reply(
      'Произошло что-то непредвиденное вы будете перенесены в меню.',
    );
    ctx.scene.leave();
    ctx.scene.enter('menu');
  }
  await ctx.reply(
    `Этап 2/3
        Отлично, теперь можете прикрепить необходимые документы /фото
        чтобы поставщики лучше поняли Вас либо пропустить этот этап.

        Если Вы хотите прикрепить документ или фотографию, нажмите на кнопку на Вашей клавиатуре.,
        `,
  );
  await ctx.replyWithPhoto(
    {
      source: 'src/static/fileadd.jpg',
    },
    Markup.inlineKeyboard([
      Markup.callbackButton('Назад', 'back'),
      Markup.callbackButton('Пропустить шаг', 'next'),
    ]).extra(),
  );
  return ctx.wizard.next();
};

module.exports = {
  sceneEnterStep: enterStepFunc,
  docEnterStep: documentEnterStepFunc,
};
