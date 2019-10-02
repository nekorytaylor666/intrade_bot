/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const User = require('../models/User');
const authScene = new Scene('auth');


//menu scene enter
authScene.enter(async (ctx) => {
    try {
        ctx.reply('Send me your number please', {
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
    } catch (error) {
        console.log(error);
    }
});

authScene.on('contact', async ctx => {
    //we need to check to user id with contact id to prevent cending another user contacts
    const user_id = ctx.message.from.id;
    const contact_id = ctx.message.from.id;
    if (user_id === contact_id) {
        User.findOne({
            telegramUserId: user_id
        }, async function (err, user) {
            if (err) {
                console.log(err);
            }
            //if a user was found we just put him in the session, else we create new one by request
            if (user) {
                ctx.session.user = user;
                await ctx.reply(`Welcome back ${user.firstName} you have benn authtorized in intrade bot!`, {
                    reply_markup: {
                        remove_keyboard: true
                    }
                });
            } else {
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
                    const db_user = await newUser.save();
                    ctx.session.user = db_user;

                    await ctx.reply(`Thank you ${first_name} you have benn authtorized in intrade bot!`, {
                        reply_markup: {
                            remove_keyboard: true
                        }
                    });
                } catch (error) {
                    ctx.reply(`Something went wrong pls request to nekorytaylor2@gmail.com.\n\n ${error}`)
                }

            }
            return ctx.scene.enter('menu');
        });
    } else {
        ctx.reply('You should send your contact number. Use menu keyboard to do it faster');
        return ctx.scene.enter('auth');
    }

});



module.exports = authScene;