/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer')
const Markup = require('telegraf/markup')



const lastStep = new Composer();

lastStep.hears('Далее', ctx => {
    ctx.reply(`Отлично!
    Твой заказ проходит модерацию! Обычно модерация занимает пару часов. 
    Вам придет уведомление как только модератор пропустит заказ.`, Markup.inlineKeyboard([
        Markup.callbackButton('Предпросмотр заказа', 'preview'),
        Markup.callbackButton('В главное меню', 'menu'),
    ], {
        columns: 1
    }).extra());
});

lastStep.action('preview', async ctx => {
    const description = ctx.scene.session.description;

    const cities = ctx.scene.session.cities;
    const customer = ctx.session.user;
    await ctx.reply(`Описание:
    ${description}
    
    В городе(-ах): ${cities.map(city=>`${city}`)}
    
    Контакты для связи:
    Имя: ${customer.firstName?customer.firstName:'не заполнено'}
    Компания: ${customer.companyName? customer.companyName: 'не заполнено'}
    Телефон: ${customer.phoneNumber?customer.phoneNumber:'не заполнено'}
    E-mail: ${customer.email?customer.email:'не заполнено'}`, Markup.inlineKeyboard([
        Markup.callbackButton('В главное меню', 'menu'),
    ], {
        columns: 1
    }).extra());

    if (ctx.scene.session.fileId) {
        const docType = ctx.scene.session.docType;
        const fileId = ctx.scene.session.fileId;
        switch (docType) {
            case 'doc':
                await ctx.replyWithDocument(fileId);
                break;
            case 'photo':
                await ctx.replyWithPhoto(fileId);
            default:
                break;
        }
    }
});

lastStep.action('menu', ctx => {
    ctx.scene.leave();
    ctx.scene.enter('menu');
});
module.exports = lastStep;