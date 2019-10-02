/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
//package imports
const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('telegraf/session')
const Stage = require('telegraf/stage');
// const RedisSession = require('telegraf-session-redis');
const mongoose = require('mongoose');
const cron = require('node-cron');

const {
	enter
} = Stage

const checkUserForOutDatingOrders = require('./helpers/activeOrdersChecker');

//menu scene
const authScene = require('./scenes/authScene');

//order registration scene
const orderRegistrationScene = require('./scenes/orderRegScene');

//order registration scene
const menuScene = require('./scenes/menuScene');

//handles inline queries in inline mode of bot
const inlineHandler = require('./helpers/inlineQueryHandler');

const ordersList = require('./scenes/ordersScene');

//mongoose connection
mongoose.connect('mongodb://localhost:27017/intradeBot', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log('mongodb connected...'))
	.catch(err => console.log(err));

mongoose.set("debug", (collectionName, method, query, doc) => {
	console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});
//env variables
const port = process.env.PORT;
const apiToken = process.env.TELEGRAM_TOKEN;
// const webHookUrl = process.env.WEBHOOK_URL;

//essential inits
const bot = new Telegraf(apiToken);
const app = express();

//reddis session
// const session = new RedisSession({
// 	store: {
// 		host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
// 		port: process.env.TELEGRAM_SESSION_PORT || 6379
// 	}
// });
bot.use(session());


//to accept json data
app.use(bodyParser.json());

//inline handler init
bot.use(inlineHandler);

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});

const stage = new Stage([orderRegistrationScene, authScene, menuScene, ordersList], {
	default: 'menuScene'
});
bot.use(stage.middleware());
bot.command('start', enter('auth'));
bot.use(Telegraf.log());
bot.launch();

cron.schedule('* 12 * * *', checkUserForOutDatingOrders);