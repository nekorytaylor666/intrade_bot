/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Telegraf = require('telegraf');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

//handles database saving of order
const saveHandler = require('../helpers/saveHandler');

//handles input and exiting from scene
const orderHandler = require('../helpers/orderHandler');

const orderRegistrationScene = new Scene('orderRegistration');

orderRegistrationScene.use(saveHandler);
orderRegistrationScene.use(orderHandler);

orderRegistrationScene.enter(ctx => {
  const title = ctx.session.title ? ctx.session.title : 'none';
  const description = ctx.session.description
    ? ctx.session.description
    : 'none';
  ctx.reply(
    `This is yours article: 
		title: ${title}
		description: ${description}
		

		to edit any of this fields just type /[name of field] [value of field]
		example: /title my awesome title.
	`,
    Markup.inlineKeyboard([
      Markup.callbackButton('Save', 'save'),
      Markup.callbackButton('Cancel', 'cancel'),
    ]).extra(),
  );
});

module.exports = orderRegistrationScene;
