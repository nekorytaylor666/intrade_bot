/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const User = require('../models/User');
const authScene = new Scene('auth');


//menu scene enter
authScene.enter(async (ctx) => {
    return ctx.reply('Send me your number please', {
        reply_markup: {
            keyboard: [
                [{
                    text: '📲 Send phone number',
                    request_contact: true
                    //ask permission to send their contact number
                }]
            ],
        }
    });
});

authScene.on('contact', async ctx => {
    //we need to check to user id with contact id to prevent cending another user contacts
    const user_id = ctx.message.from.id;
    const contact_id = ctx.message.from.id;
    if (user_id === contact_id) {
        const {
            first_name,
            last_name,
        } = ctx.message.from;

        const phone_number = ctx.message.contact.phone_number;

        const newUser = new User({
            phoneNumber: phone_number,
            firstName: first_name,
            lastName: last_name,
            telegramUserId: user_id,
            isPremium: false
        });

        try {
            await newUser.save();
        } catch (error) {
            return ctx.reply('Something went wrong pls request to nekorytaylor2@gmail.com')
        }

        await ctx.reply(`Thank you ${first_name} you have benn authtorized in intrade bot!`, {
            reply_markup: {
                remove_keyboard: true
            }
        });

        //go to menu scene
        return ctx.scene.enter('menu');
    } else {
        ctx.reply('You should send your contact number. Use menu keyboard to do it faster');
        return ctx.scene.enter('auth');
    }

});



module.exports = authScene;