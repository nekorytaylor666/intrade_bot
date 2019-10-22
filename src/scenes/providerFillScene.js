const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const mediaHandler = require('../helpers/providerFillHandler/mediaHandler');

const descHandler = require('../helpers/providerFillHandler/descHandler');

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
