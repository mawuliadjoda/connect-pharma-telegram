require('dotenv').config()
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const { PORT, TELEGRAM_TOKEN, SERVER_URL_PROD, SERVER_URL_DEV, ENVIRONMENT, WEB_LINK } = process.env
const SERVER_URL = ENVIRONMENT === 'dev' ? SERVER_URL_DEV : SERVER_URL_PROD;



const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start((ctx) => {
  ctx.reply('Bienvenue ! \n Connect Pharma \n');
  ctx.reply('Choisir une option');
});

bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('hipster', Telegraf.reply('λ'));


bot.command("location", ctx => {
	return ctx.reply(
		"Please share your location",
		Markup.keyboard([
			Markup.button.locationRequest("Share location"),
		])
        .oneTime()
        .resize()       
        ,
	)
})

bot.on(message("location"), ctx => {
	const { latitude, longitude } = ctx.message.location

	  console.log({ latitude, longitude });
    const latitudeFr = convertToFRecimal(latitude);
    const longitudeFr = convertToFRecimal(longitude);

    console.log({ latitudeFr, longitudeFr })
    console.log(`${WEB_LINK}/${latitudeFr}/${longitudeFr}`);

    ctx.reply("Welcome :)))))", {
        reply_markup: {
          keyboard: [[{
             text: "Clicker ici pour ouvrir web app Telegram", 
             web_app: { url: `${WEB_LINK}/${latitudeFr}/${longitudeFr}` } 
            }]],
        },
    })
})

bot.on(message('text'), async (ctx) => {
  // Explicit usage
  await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.first_name}`);

  // Using context shortcut
  await ctx.reply(`Hello ${ctx.message.from.first_name}`);
});





// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    domain: SERVER_URL,
    port: PORT
  },
})
.then(() => {
  console.log("Webhook bot listening on port", PORT);
})
.catch(() => {
  console.error("Error while lanch Webhook ");
});


// https://www.npmjs.com/package/telegraf



function convertToFRecimal(value) {
  const valueString = String(value);
  if (!valueString?.includes(".")) return valueString;
  const latTab = valueString?.split(".");
  const decimalPart = latTab ? latTab[0] : 0;
  const floatingPart = latTab ? latTab[1] : 0;
  return `${decimalPart},${floatingPart}`;
}