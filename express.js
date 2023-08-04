require('dotenv').config()


const express = require('express')
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');


const PORT = 4000;
const web_link = "https://connect-pharma-911ea.web.app/nearestPharmacies/6,2469878/1,1449074";

async function main() {
	const bot = new Telegraf('6674210123:AAGtqYo5kTSDuJqcXSmFWUxVyU3JmtcFdVg');


	bot.start((ctx) => ctx.reply('Welcome'));

	bot.help((ctx) => ctx.reply("your hit the help button"));


	bot.command('oldschool', (ctx) => ctx.reply('Hello'));
	bot.command('hipster', Telegraf.reply('λ'));




	bot.command('location', ctx => {
		return ctx.reply(
			"Please share your location",
			Markup.keyboard([
				Markup.button.locationRequest("Share location"),
			])
				// .oneTime()
				// .resize()

				.oneTime()
				.resize()

			,
		)
	})

	bot.on(message('location'), ctx => {
		const { latitude, longitude } = ctx.message.location

		console.log({ latitude, longitude })

		ctx.reply("Welcome :)))))", {
			reply_markup: {
				keyboard: [[{ text: "Clicker ici pour ouvrir web app Telegram", web_app: { url: web_link } }]],
			},
		})
	})

	bot.on(message('text'), async (ctx) => {
		// Explicit usage
		await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.first_name}`);

		// Using context shortcut
		await ctx.reply(`Hello ${ctx.message.from.first_name}`);
	});



	const app = express();
	// Set the bot API endpoint
	app.use(await bot.createWebhook({ domain: 'https://7547-2c0f-f0f8-61c-4c01-6c60-e394-1b1d-abb7.ngrok-free.app' }));
	app.listen(PORT, () => console.log("Listening on port", PORT));
}

main();


// https://github.com/telegraf/telegraf/discussions/1706
// https://github.com/feathers-studio/telegraf-docs/tree/master/examples/webhook