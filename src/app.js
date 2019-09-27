/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
//package imports
const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');
const RedisSession = require('telegraf-session-redis');
const mongoose = require('mongoose');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/intradeBot', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('mongodb connected...'))
	.catch(err => console.log(err));

//env variables
const port = process.env.PORT;
const apiToken = process.env.TELEGRAM_TOKEN;
// const webHookUrl = process.env.WEBHOOK_URL;

//essential inits
const bot = new Telegraf(apiToken);
const app = express();

//reddis session
const session = new RedisSession({
	store: {
		host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
		port: process.env.TELEGRAM_SESSION_PORT || 6379
	}
});
bot.use(session);


//to accept json data
app.use(bodyParser.json());

//routers

//handles database saving of order
const saveHandler = require('./helpers/saveHandler');

//handles input and exiting from scene
const orderHandler = require('./helpers/orderHandler');

//handles inline queries in inline mode of bot
const inlineHandler = require('./helpers/inlineQueryHandler');



//order registration scene
const orderRegistration = new Scene('orderRegistration');

//handlers init
orderRegistration.use(saveHandler);
orderRegistration.use(orderHandler);
bot.use(inlineHandler);

//Composer cant replicate enter event, so it should be there 
//TODO move enter event to separate file
orderRegistration.enter((ctx) => {
	const title = ctx.session.title ? ctx.session.title : 'none';
	const description = ctx.session.description ? ctx.session.description : 'none';
	ctx.reply(
		`This is yours article: 
		title: ${title}
		description: ${description}
		

		to edit any of this fields just type /[name of field] [value of field]
		example: /title my awesome title.
	`,
		Markup.inlineKeyboard([
			Markup.callbackButton('Save', 'save')
		]).extra());
});

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});

const stage = new Stage([orderRegistration]);

bot.use(stage.middleware());
bot.command('neworder', (ctx) => ctx.scene.enter('orderRegistration'));

bot.launch();