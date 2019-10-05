/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
//package imports
const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('telegraf/session')
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup')
const mongoose = require('mongoose');
const cron = require('node-cron');

const {
	enter
} = Stage

const checkUserForOutDatingOrders = require('./helpers/activeOrdersChecker');

//menu scene
const authScene = require('./scenes/authScene');

//order registration scene
const orderRegistrationScene = require('./scenes/orderRegWizardScene');

//order registration scene
const menuScene = require('./scenes/menuScene');

//handles inline queries in inline mode of bot
const inlineHandler = require('./helpers/inlineQueryHandler');

const ordersList = require('./scenes/ordersListScene');

const orders = require('./scenes/orders');

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


const bot = new Telegraf(apiToken);
const app = express();

bot.use(session());


//to accept json data
app.use(bodyParser.json());

//inline handler init
bot.use(inlineHandler);

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});

const stage = new Stage([orderRegistrationScene, authScene, menuScene, ordersList, orders], {
	default: 'menuScene'
});
bot.use(stage.middleware());
bot.command('start', enter('auth'));
bot.use(ctx => {
	ctx.reply('Ваша сессия истекла. Прошу перезагрузите бота или введите команду /start', Markup
		.keyboard([
			['/start'],
		])
		.oneTime()
		.resize()
		.extra());
});
bot.use(Telegraf.log());
bot.launch();

cron.schedule('0 12 * * *', checkUserForOutDatingOrders);