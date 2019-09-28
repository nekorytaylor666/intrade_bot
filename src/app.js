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
const {
	enter
} = Stage



//menu scene
const menuScene = require('./scenes/menuScene');

//order registration scene
const orderRegistrationScene = require('./scenes/orderRegScene');

//handles inline queries in inline mode of bot
const inlineHandler = require('./helpers/inlineQueryHandler');

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

//inline handler init
bot.use(inlineHandler);

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});

const stage = new Stage([orderRegistrationScene, menuScene], {
	default: menuScene
});
bot.use(stage.middleware());
bot.action('neworder', enter('orderRegistration'));
bot.command('start', enter('menu'));
bot.launch()