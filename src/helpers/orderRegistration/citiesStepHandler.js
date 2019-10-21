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
];

citiesStepHandler.hears('Назад', ctx => {
  ctx.reply(`Вы вернулись на этап 2/3`);
  ctx.scene.session.fileId = null;
  ctx.wizard.back(); // Set the listener to the previous function
  ctx.wizard.back(); // Set the listener to the previous function
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});

citiesStepHandler.hears('Далее', ctx => {
  const choosenCities =
    typeof ctx.scene.session.cities !== 'undefined'
      ? [...ctx.scene.session.cities]
      : [];
  const availableCities =
    typeof ctx.scene.session.availableCities !== 'undefined'
      ? [...ctx.scene.session.availableCities]
      : [...CITIES];
  const choosenCitiesInlineButton = choosenCities.map(cityName =>
    Markup.callbackButton(`✅ ${cityName}`, `city ${cityName}`),
  );
  const availableCitiesInlineButton = availableCities.map(cityName =>
    Markup.callbackButton(cityName, `city ${cityName}`),
  );
  ctx.reply(
    `Этап 3/5
    Еще чуть чуть!
    
    Выбери необходимый город в котором тебе нужен поставщик`,
    Markup.inlineKeyboard(
      choosenCitiesInlineButton.concat(
        availableCitiesInlineButton,
        Markup.callbackButton(`All`, `city All`),
      ),
      {
        columns: 1,
      },
    ).extra(),
  );
});

citiesStepHandler.action(/(?![city])\b(?!\s)([\w]*)/gm, ctx => {
  if (ctx.match[0] === 'All') {
    const choosenCities = [...CITIES];
    const availableCities = [];

    ctx.scene.session.cities = choosenCities;
    ctx.scene.session.availableCities = availableCities;

    const availableCitiesInlineButton = availableCities.map(
      cityName => Markup.callbackButton(cityName, `city ${cityName}`),
    );
    const choosenCitiesInlineButton = choosenCities.map(cityName =>
      Markup.callbackButton(`✅ ${cityName}`, `city ${cityName}`),
    );
    ctx.editMessageText(
      `Этап 3/5
      Еще чуть чуть!
        
      Выбери необходимый город в котором тебе нужен поставщик`,
      Markup.inlineKeyboard(
        choosenCitiesInlineButton.concat(
          availableCitiesInlineButton,
          Markup.callbackButton(`All`, `city All`),
        ),
        {
          columns: 1,
        },
      ).extra(),
    );
    return ctx.reply(
      `Вы выбрали город(-а) ${choosenCities.map(
        city => `${city}`,
      )}! Нажмите "ок", чтобы продолжить.`,
      Markup.keyboard([['🆗 Ок']])
        .oneTime()
        .resize()
        .extra(),
    );
  }

  const availableCities =
    typeof ctx.scene.session.availableCities !== 'undefined'
      ? [...ctx.scene.session.availableCities]
      : [...CITIES];

  const cities =
    typeof ctx.scene.session.cities !== 'undefined'
      ? [...ctx.scene.session.cities]
      : [];
  const choosenCity = ctx.match[0];
  const indexOfChoosenCity = cities.indexOf(choosenCity);

  if (indexOfChoosenCity === -1) {
    cities.push(choosenCity);
    availableCities.splice(availableCities.indexOf(choosenCity), 1);
  }
  if (indexOfChoosenCity !== -1) {
    cities.splice(indexOfChoosenCity, 1);
    availableCities.push(choosenCity);
  }

  ctx.scene.session.cities = cities;
  ctx.scene.session.availableCities = availableCities;

  const choosenCitiesInlineButton = cities.map(cityName =>
    Markup.callbackButton(`✅ ${cityName}`, `city ${cityName}`),
  );
  const availableCitiesInlineButton = availableCities.map(cityName =>
    Markup.callbackButton(cityName, `city ${cityName}`),
  );

  ctx.editMessageText(
    `Этап 3/5
    Еще чуть чуть!
    
    Выбери необходимый город в котором тебе нужен поставщик`,
    Markup.inlineKeyboard(
      choosenCitiesInlineButton.concat(
        availableCitiesInlineButton,
        Markup.callbackButton(`All`, `city All`),
      ),
      {
        columns: 1,
      },
    ).extra(),
  );
  return ctx.reply(
    `Город(-а):${cities.map(city => `${city}`)}!`,
    Markup.keyboard([['🆗 Ок']])
      .oneTime()
      .resize()
      .extra(),
  );
});

citiesStepHandler.hears('🆗 Ок', ctx => {
  const cities =
    typeof ctx.scene.session.cities !== 'undefined'
      ? [...ctx.scene.session.cities]
      : ['Нет городов'];
  if (cities.length < 1) {
    return ctx.reply(
      'Должен быть выбран по меньшей мере один город!',
    );
  }
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
