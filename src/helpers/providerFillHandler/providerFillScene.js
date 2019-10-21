const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const superWizard = new WizardScene(
  'super-wizard',
  ctx => {
    ctx.reply(
      'Step 1',
      Markup.inlineKeyboard([
        Markup.urlButton('❤️', 'http://telegraf.js.org'),
        Markup.callbackButton('➡️ Next', 'next'),
      ]).extra(),
    );
    return ctx.wizard.next();
  },
  stepHandler,
  ctx => {
    ctx.reply('Step 3');
    return ctx.wizard.next();
  },
  ctx => {
    ctx.reply('Step 4');
    return ctx.wizard.next();
  },
  ctx => {
    ctx.reply('Done');
    return ctx.scene.leave();
  },
);
