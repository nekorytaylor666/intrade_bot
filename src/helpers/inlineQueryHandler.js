/* eslint-disable @typescript-eslint/no-var-requires */
const Composer = require('telegraf/composer');

const inlineHandler = new Composer();

inlineHandler.on('inline_query', ctx => {
    const query = ctx.update.inline_query.query; // If you analyze the context structure, query field contains our query.
    if (query.startsWith("/")) { // If user input is @yourbot /command
        if (query.startsWith("/audio_src")) { // If user input is @yourbot /audio_src
            // In this case we answer with a list of ogg voice data.
            // It will be shown as a tooltip. You can add more than 1 element in this JSON array. Check API usage "InlineResultVoice".
            return ctx.answerInlineQuery([{
                type: 'voice', // It's a voice file.
                id: ctx.update.inline_query.id, // We reflect the same ID of the request back.
                title: 'Send audio file sample.ogg', // Message appearing in tooltip.
                voice_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
                voice_duration: 16, // We can specify optionally the length in seconds.
                caption: '[BOT] Audio file sample.ogg!' // What appears after you send voice file.
            }]);
        }
    } else { // If user input is @yourbot name
        const name_target = query; // Let's assume the query is actually the name.
        const message_length = name_target.length; // Name length. We want to ensure it's > 0.
        if (message_length > 0) {
            let full_message;
            const dice = Math.floor(Math.random() * 8) + 1; // Let's throw a dice for a random message. (1, 8)
            switch (dice) {
                case 1:
                    full_message = "IMHO, " + name_target + " sucks.";
                    break;
                case 2:
                    full_message = "IMHO, " + name_target + " is awesome";
                    break;
                case 3:
                    full_message = name_target + " is not a nice people for me...";
                    break;
                case 4:
                    full_message = name_target + " for me you are c- Eh! You wanted!";
                    break;
                case 5:
                    full_message = "Whoa! " + name_target + " is very cool!";
                    break;
                case 6:
                    full_message = "Grifondoro! No wait, " + name_target + " you're such a noob.";
                    break;
                case 7:
                    full_message = "Sometimes I ask myself why people like " + name_target + " dress up and walk around like that...";
                    break;
                case 8:
                    full_message = "Watch him! Watch! " + name_target + " is so ugly!";
                    break;
            }
            // Let's return a single tooltip, not cached (In order to always change random value).
            return ctx.answerInlineQuery([{
                type: 'article',
                id: ctx.update.inline_query.id,
                title: 'You have inserted: ' + name_target,
                description: 'What does bot thinks about ' + name_target + '?',
                input_message_content: {
                    message_text: full_message
                }
            }], {
                cache_time: 0
            });
        }
    }
});


module.exports = inlineHandler;