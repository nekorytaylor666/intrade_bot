/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const mongoose = require('mongoose');

const deeplinkHandler = require('./helpers/deeplinkHandler');
console.log(process.env.MONGO_CONNECTION_STRING);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Approve BOT: mongodb connected...'))
  .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);

mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(
    `${collectionName}.${method}`,
    JSON.stringify(query),
    doc,
  );
});

const apiToken = process.env.APPROVE_TELEGRAM_TOKEN;

const bot = new Telegraf(apiToken);

bot.use(session());
bot.use(deeplinkHandler);
// deeplinkHandler
bot.use(ctx => {
  ctx.reply(
    'Данный бот предназначен только для продавцов. Здесь вы можете найти покупателей для вашего бизнеса.',
  );
});
bot.catch(err => {
  console.log(err);
});
bot.use(Telegraf.log());
bot.launch();
