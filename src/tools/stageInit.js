const Stage = require('telegraf/stage');

//TODO implement inline handler
// const inlineHandler = require('./helpers/inlineQueryHandler');

//order registration scene
const menuScene = require('../scenes/menuScene');

//auth scene
const authScene = require('../scenes/authScene');

//order registration scene
const orderRegistrationScene = require('../scenes/orderRegWizardScene');
const ordersList = require('../scenes/ordersListScene');
const orders = require('../scenes/orders');

//help scene
const aboutScene = require('../helpers/helpScenes/aboutScene');
const forCustomers = require('../helpers/helpScenes/forCustomers');
const forProviders = require('../helpers/helpScenes/forProviders');
const faq = require('../helpers/helpScenes/faq');
const helpScene = require('../scenes/helpMenu');

//settings scenes
const settingsMenu = require('../scenes/settingsMenu');
const contactEditScene = require('../helpers/settingsScenes/contactEditScene');

//provider fill scene
const providerFillScene = require('../scenes/providerFillScene');

//payments scene
const paymentScene = require('../scenes/paymentScene');

const stage = new Stage(
  [
    orderRegistrationScene,
    authScene,
    providerFillScene,
    menuScene,
    ordersList,
    settingsMenu,
    orders,
    helpScene,
    forProviders,
    forCustomers,
    contactEditScene,
    faq,
    aboutScene,
    paymentScene,
  ],
  {
    default: 'menuScene',
  },
);

module.exports = stage;
