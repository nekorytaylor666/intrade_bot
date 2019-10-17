/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
//package imports
const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const mongoose = require('mongoose');
const cron = require('node-cron');

const { enter } = Stage;

const checkUserForOutDatingOrders = require('./helpers/activeOrdersChecker');

const providerRequestHandler = require('./helpers/channelHandler/providerRequestHandler');

const adminGroupHandler = require('./helpers/adminGroupHandlers/adminGroupHandlers');
//mongoose connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Intrade BOT: mongodb connected...'))
  .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);

mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(
    `${collectionName}.${method}`,
    JSON.stringify(query),
    doc,
  );
});
//env variables
const port = process.env.APPROVE_PORT;
const apiToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(apiToken);
const app = express();

bot.use(session());

//to accept json data
app.use(bodyParser.json());

app.listen(port, function() {
  console.log(`Intrade BOT: Example app listening on port ${port}!`);
});

const stage = require('./tools/stageInit');

bot.use(stage.middleware());
bot.use(adminGroupHandler);
bot.use(providerRequestHandler);

bot.command('start', ctx => {
  const chatType = ctx.message.chat.type;
  if (chatType === 'private') {
    return ctx.scene.enter('auth');
  }
  if (chatType === 'group') {
    //TODO get rid of this shit.
    ctx.reply(`i'm alive!`);
  }
});

bot.use(ctx => {
  if (ctx.message) {
    const chatType = ctx.message.chat.type;

    if (chatType === 'group') {
      return ctx.reply(`I cant't handle this command`);
    }
    ctx.reply(
      'Ваша сессия истекла. Прошу перезагрузите бота или введите команду /start',
      Markup.keyboard([['/start']])
        .oneTime()
        .resize()
        .extra(),
    );
  }
});
bot.catch(err => {
  console.log(err);
});
bot.use(Telegraf.log());
bot.launch();
//Время стоит по немецкему. Зависит от часового пояса сервера
cron.schedule('0 12 * * *', checkUserForOutDatingOrders);
