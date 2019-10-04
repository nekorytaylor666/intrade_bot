/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const {
    Extra
} = require('telegraf');
const {
    enter,
    leave
} = Stage

const documentStepHandler = require('../helpers/orderRegistration/documentSceneHandler');

const citiesStepHandler = require('../helpers/orderRegistration/citiesStepHandler');

const orderRegistrationScene = new WizardScene('orderReg', ctx => {
    try {
        ctx.reply(`Этап: 1/3
        Опишите что Вам нужно?
        
        Пример: срочно нужны 50 штук видеокамер компании hiwatch, модель B5456, срок поставки до 5 октября, цена до 3000 тенге.
    
        Помните что чем подробнее Вы описали свой заказ, тем охотнее поставщики отклинутся на него.`);
        return ctx.wizard.next();
    } catch (error) {
        console.log(error);
    }
}, ctx => {
    ctx.scene.session.description = ctx.message.text;
    ctx.reply(`Этап 2/3
        Отлично, теперь можете прикрепить необходимые документы /фото
        чтобы поставщики лучше поняли Вас либо пропустить этот этап.`, Markup.inlineKeyboard([
        Markup.callbackButton('Назад', 'back'),
        Markup.callbackButton('Пропустить шаг', 'next')
    ]).extra());
    return ctx.wizard.next();
}, documentStepHandler, citiesStepHandler, ctx => {
    if (typeof ctx.scene.session.fileId !== 'undefined') {
        ctx.replyWithDocument(ctx.scene.session.fileId);
    }
    ctx.reply('done!');
    ctx.scene.leave();
    ctx.scene.enter('orders');
});

module.exports = orderRegistrationScene;