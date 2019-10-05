/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const {
    Extra
} = require('telegraf');
const {
    enter,
    leave
} = Stage

const documentStepHandler = require('../helpers/orderRegistration/documentSceneHandler');

const citiesStepHandler = require('../helpers/orderRegistration/citiesStepHandler');

const contactStepHandler = require('../helpers/orderRegistration/contactStepHandler');

const enterStepsFuncs = require('../helpers/orderRegistration/sideHandlers');

const lastStepFunc = async (ctx) => {
    if (ctx.scene.session.fileId) {
        const docType = ctx.scene.session.docType;
        const fileId = ctx.scene.session.fileId;
        switch (docType) {
            case 'doc':
                await ctx.replyWithDocument(fileId);
                break;
            case 'photo':
                await ctx.replyWithPhoto(fileId);
            default:
                break;
        }
    }
    await ctx.reply('done!');
    ctx.scene.leave();
    ctx.scene.enter('orders');
}

const orderRegistrationScene = new WizardScene('orderReg',
    enterStepsFuncs.sceneEnterStep, //first step. Handles input of description but doesn't save it.
    enterStepsFuncs.docEnterStep, // second. Saves input of desc, then shows interface for documents
    documentStepHandler, // third. Saves file or handles skip of step
    citiesStepHandler, //forth. Handles choose of city.
    contactStepHandler, // fifth. Handles input of contacts
    lastStepFunc // savings to db and last message of this button
);

module.exports = orderRegistrationScene;