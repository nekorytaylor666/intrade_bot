/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');

const citiesStepHandler = new Composer();

const CITIES = [
  'Astana',
  'Almaty',
  'Karagandy',
  'Shymkent',
  'Atyrau',
  'Aktau',
  'All',
];

citiesStepHandler.hears('Назад', ctx => {
  ctx.reply(`Вы вернулись на этап 2/3`);
  ctx.scene.session.fileId = null;
  ctx.wizard.back(); // Set the listener to the previous function
  ctx.wizard.back(); // Set the listener to the previous function
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});

citiesStepHandler.hears('Далее', ctx => {
  ctx.reply(
    `Этап 3/5
    Еще чуть чуть!
    
    Выбери необходимый город в котором тебе нужен поставщик`,
    Markup.inlineKeyboard(
      CITIES.map(cityName =>
        Markup.callbackButton(cityName, `city ${cityName}`),
      ),
      {
        columns: 1,
      },
    ).extra(),
  );
});

citiesStepHandler.action(/(?![city])\b(?!\s)([\w]*)/gm, ctx => {
  if (ctx.match[0] === 'All') {
    const cities = [
      'Astana',
      'Almaty',
      'Karagandy',
      'Shymkent',
      'Atyrau',
      'Aktau',
    ];
    ctx.scene.session.cities = cities;
    return ctx.reply(
      `Вы выбрали город(-а) ${cities.map(
        city => `${city}`,
      )}! Нажмите "ок", чтобы продолжить.`,
      Markup.keyboard([['ok']])
        .oneTime()
        .resize()
        .extra(),
    );
  }
  const cities =
    typeof ctx.scene.session.cities !== 'undefined'
      ? [...ctx.scene.session.cities]
      : [];
  const newCity = ctx.match[0];
  cities.indexOf(newCity) === -1
    ? cities.push(newCity)
    : ctx.reply(`Вы уже выбрали город ${newCity}`);
  ctx.scene.session.cities = cities;
  return ctx.editMessageText(
    `Вы выбрали город(-а) ${cities.map(
      city => `${city}`,
    )}! Нажмите "ок", чтобы продолжить.`,
    Markup.inlineKeyboard(
      CITIES.map(cityName =>
        Markup.callbackButton(cityName, `city ${cityName}`),
      ),
      {
        columns: 1,
      },
    ).extra(),
  );
});

citiesStepHandler.hears('ok', ctx => {
  const cities =
    typeof ctx.scene.session.cities !== 'undefined'
      ? [...ctx.scene.session.cities]
      : ['Нет городов'];
  ctx.reply(
    `Ваш окончательный список городов ${cities.map(
      city => `${city}`,
    )}!`,
    Markup.keyboard([['Далее'], ['Назад']])
      .oneTime()
      .resize()
      .extra(),
  );
  return ctx.wizard.next();
});

citiesStepHandler.use(ctx => {
  ctx.reply('Пожалуйста, используйте меню.');
});

module.exports = citiesStepHandler;
