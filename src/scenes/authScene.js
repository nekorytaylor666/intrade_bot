/* eslint-disable @typescript-eslint/no-var-requires */
const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const authScene = new Scene('auth');


//menu scene enter
authScene.enter(async (ctx) => {
    ctx.reply('Send me your number please', {
        reply_markup: {
            keyboard: [
                [{
                    text: '📲 Send phone number',
                    request_contact: true
                }]
            ],
        }
    });
});

authScene.on('contact', async ctx => {
    const user_id = ctx.message.from.id;
    const contact_id = ctx.message.from.id;
    if (user_id === contact_id) {
        const {
            phone_number,
            first_name,
            last_name,
            user_id
        } = ctx.message.from;
        await ctx.reply(`Thank you ${first_name} you have benn authtorized in intrade bot!`, {
            reply_markup: {
                remove_keyboard: true
            }
        });
        ctx.scene.enter('menu');
    } else {
        ctx.reply('You should send your contact number. Use menu keyboard to do it faster');
    }

});



module.exports = authScene;