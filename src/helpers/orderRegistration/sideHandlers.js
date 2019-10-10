/* eslint-disable @typescript-eslint/no-var-requires */
const Markup = require('telegraf/markup');

const enterStepFunc = ctx => {
  try {
    ctx.reply(`Этап: 1/3
        Опишите что Вам нужно?
        
        Пример: срочно нужны 50 штук видеокамер компании hiwatch, модель B5456, срок поставки до 5 октября, цена до 3000 тенге.
    
        Помните что чем подробнее Вы описали свой заказ, тем охотнее поставщики отклинутся на него.`);
    return ctx.wizard.next();
  } catch (error) {
    console.log(error);
  }
};

const documentEnterStepFunc = ctx => {
  ctx.scene.session.description = ctx.message.text;
  ctx.reply(
    `Этап 2/3
        Отлично, теперь можете прикрепить необходимые документы /фото
        чтобы поставщики лучше поняли Вас либо пропустить этот этап.`,
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
