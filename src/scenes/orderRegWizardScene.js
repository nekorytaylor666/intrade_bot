const WizardScene = require('telegraf/scenes/wizard');

const documentStepHandler = require('../helpers/orderRegistration/documentSceneHandler');

const citiesStepHandler = require('../helpers/orderRegistration/citiesStepHandler');

const contactStepHandler = require('../helpers/orderRegistration/contactStepHandler');

const enterStepsFuncs = require('../helpers/orderRegistration/sideHandlers');

const confirmationStepHandler = require('../helpers/orderRegistration/lastStepHandler');

const orderRegistrationScene = new WizardScene(
  'orderReg',
  enterStepsFuncs.sceneEnterStep, //first step. Handles input of description but doesn't save it.
  enterStepsFuncs.docEnterStep, // second. Saves input of desc, then shows interface for documents
  documentStepHandler, // third. Saves file or handles skip of step
  citiesStepHandler, //forth. Handles choose of city.
  contactStepHandler,
  confirmationStepHandler, // savings to db and last message of this button
);

orderRegistrationScene.hears('Отмена', ctx => {
  ctx.scene.leave();
  ctx.scene.enter('orders');
});

orderRegistrationScene.command('cancel', ctx => {
  ctx.scene.leave();
  ctx.scene.enter('orders');
});

module.exports = orderRegistrationScene;
