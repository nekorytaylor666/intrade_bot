/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const {
    Extra
} = require('telegraf');

const citiesStepHandler = new Composer();
citiesStepHandler.hears('Назад', ctx => {
    ctx.reply(`Вы вернулись на этап 2/3`);
    ctx.wizard.back(); // Set the listener to the previous function
    ctx.wizard.back(); // Set the listener to the previous function
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});
citiesStepHandler.hears('Далее', ctx => {
    ctx.reply(`Этап 3/5
    Еще чуть чуть!
    
    Выбери необходимый город в котором тебе нужен поставщик`, Markup.inlineKeyboard([
        Markup.callbackButton('Астана', 'city Astana'),
        Markup.callbackButton('Алматы', 'city Almaty'),
        Markup.callbackButton('Караганда', 'city Karagandy'),
        Markup.callbackButton('Шымкент', 'city Shymkent'),
        Markup.callbackButton('Атырау', 'city Atyrau'),
        Markup.callbackButton('Актау', 'city Aktau'),
        Markup.callbackButton('Все', 'all'),
    ], {
        columns: 1
    }).extra())
});

citiesStepHandler.action(/(?![city])\b(?!\s)([\w]*)/gm, ctx => {
    if (ctx.match[0] === 'all') {
        const cities = ['Astana', 'Almaty', 'Karagandy', 'Shymkent', 'Atyrau', 'Aktau'];
        ctx.scene.session.cities = cities;
        return ctx.reply(`Вы выбрали город(-а) ${cities.map(city=>`${city}`)}! Нажмите "ок", чтобы продолжить.`, Markup
            .keyboard([
                ['ok']
            ])
            .oneTime()
            .resize()
            .extra());
    }
    const cities = typeof ctx.scene.session.cities !== 'undefined' ? [...ctx.scene.session.cities] : [];
    const newCity = ctx.match[0];
    cities.indexOf(newCity) === -1 ? cities.push(newCity) : ctx.reply(`Вы уже выбрали город ${newCity}`);
    ctx.scene.session.cities = cities;
    return ctx.reply(`Вы выбрали город(-а) ${cities.map(city=>`${city}`)}! Нажмите "ок", чтобы продолжить.`, Markup
        .keyboard([
            ['ok']
        ])
        .oneTime()
        .resize()
        .extra());

});

citiesStepHandler.hears('ok', ctx => {
    const cities = typeof ctx.scene.session.cities !== 'undefined' ? [...ctx.scene.session.cities] : ['Нет городов'];
    ctx.reply(`Ваш окончательный список городов ${cities.map(city=>`${city}`)}!`, Markup
        .keyboard([
            ['ok']
        ])
        .oneTime()
        .resize()
        .extra());
    return ctx.wizard.next();
});

citiesStepHandler.hears(/^((ok)$).+$/gm, (ctx) => {
    ctx.reply('Пожалуйста, используйте меню.');
});

module.exports = citiesStepHandler;