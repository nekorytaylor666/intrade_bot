/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
//package imports
const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const TelegrafInlineMenu = require('telegraf-inline-menu');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const {
	leave
} = Stage;

const RedisSession = require('telegraf-session-redis');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/intradeBot', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => console.log('mongodb connected...'))
	.catch(err => console.log(err));

//env variables
const port = process.env.PORT;
const apiToken = process.env.TELEGRAM_TOKEN;
// const webHookUrl = process.env.WEBHOOK_URL;

//essential inits
const bot = new Telegraf(apiToken);
const app = express();
const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);
app.use(bodyParser.json());



//reddis session
const session = new RedisSession({
	store: {
		host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
		port: process.env.TELEGRAM_SESSION_PORT || 6379
	}
})
bot.use(session);



const saveHandler = require('./helpers/saveHandler')


//order registration scene

const orderRegistration = new Scene('orderRegistration');

orderRegistration.use(saveHandler);

orderRegistration.enter((ctx) => {
	const title = ctx.session.title ? ctx.session.title : 'none';
	const description = ctx.session.description ? ctx.session.description : 'none';
	ctx.reply(
		`This is yours article: 
		title: ${title}
		description: ${description}
		

		to edit any of this fields just type /[name of field] [value of field]
		example: /title my awesome title.
	`, Markup.inlineKeyboard([
			Markup.callbackButton('Save', 'save')
		]).extra());
});

const retrieveValue = (ignoreString, str) => {
	const pattern1 = '(?!';
	const pattern2 = ')\\b(?![\\s])(.*)';

	const regex = new RegExp(pattern1 + ignoreString + pattern2, 'gi');

	// const regex = /(?!title)\b(?![\s])(.*)/gm;
	const match = str.match(regex);
	if (match && match[0] !== "") return match.join('');
	else return null
}

orderRegistration.command('title', (ctx) => {
	const str = ctx.message.text;
	const title = retrieveValue('title', str);
	if (title) {
		ctx.session.title = title;
		ctx.scene.reenter();
	} else {
		ctx.reply(
			`please input valid title\nexample: /title my awesome title`
		);
	}
});
// } else {
// 	ctx.reply(
// 		`please input valid title
// 		example: /title my awesome title`);
// }

// Reenter currenst scene


orderRegistration.command('description', (ctx) => {
	//remove /title from message and retrieve only title with regular expression
	const str = ctx.message.text;
	const description = retrieveValue('description', str);
	if (description) {
		ctx.session.description = description;
		ctx.scene.reenter();
	} else {
		ctx.reply(
			`please input valid description\nexample: /description my awesome description`
		);
	}
	// Reenter currenst scene
});

orderRegistration.command('buy', (ctx) => {
	ctx.reply('buy buy!');
	ctx.scene.leave();
});


//command handlers
bot.command('modern', ({
	reply
}) => reply('Yo'))


//inline query
bot.on('inline_query', ctx => {
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
				description: 'What does ' + bot.options.username + ' thinks about ' + name_target + '?',
				input_message_content: {
					message_text: full_message
				}
			}], {
				cache_time: 0
			});
		}
	}
})

// bot.start((ctx) => ctx.reply('Hey there'));

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});

const stage = new Stage([orderRegistration]);

bot.use(stage.middleware());
bot.command('neworder', (ctx) => ctx.scene.enter('orderRegistration'));


//bot launch
bot.launch();