require('dotenv').config();
//package imports
const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('telegraf/session');
const mongoose = require('mongoose');
const cron = require('node-cron');

const checkUserForOutDatingOrders = require('./helpers/activeOrdersChecker');

const providerRequestHandler = require('./helpers/channelHandler/providerRequestHandler');

const adminGroupHandler = require('./helpers/adminGroupHandlers/adminGroupHandlers');

const basicHandler = require('./helpers/botBasicHandlers');

const providerFillHandler = require('./helpers/providerFillHandler/providerFillHandler');

const stage = require('./tools/stageInit');

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
const port = process.env.PORT;
const apiToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(apiToken);
const app = express();

bot.use(session());

//to accept json data
app.use(bodyParser.json());

app.listen(port, function() {
  console.log(`Intrade BOT: Example app listening on port ${port}!`);
});

bot.use(stage.middleware());
bot.use(adminGroupHandler);
bot.use(providerRequestHandler);
bot.use(basicHandler);
bot.use(providerFillHandler);

bot.catch(err => {
  console.log(err);
});
bot.use(Telegraf.log());
bot.launch();
//Время стоит по немецкему. Зависит от часового пояса сервера
cron.schedule('0 12 * * *', checkUserForOutDatingOrders);
