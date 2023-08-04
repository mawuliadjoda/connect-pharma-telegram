const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');


const web_link = "https://connect-pharma-911ea.web.app/nearestPharmacies/6,2469878/1,1449074";


const bot = new Telegraf('6674210123:AAGtqYo5kTSDuJqcXSmFWUxVyU3JmtcFdVg');
bot.start((ctx) => ctx.reply('Welcome'));

bot.help((ctx) => ctx.reply("your hit the help button"));


bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('hipster', Telegraf.reply('λ'));

bot.command("location", ctx => {
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


bot.command('quit', async (ctx) => {
    // Explicit usage
    await ctx.telegram.leaveChat(ctx.message.chat.id);
  
    // Using context shortcut
    await ctx.leaveChat();
  });
  
  bot.on(message('text'), async (ctx) => {
    // Explicit usage
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.first_name}`);
  
    // Using context shortcut
    await ctx.reply(`Hello ${ctx.message.from.first_name}`);
  });
  

 

  bot.on(message("location"), ctx => {
	const { latitude, longitude } = ctx.message.location

	console.log({ latitude, longitude })

    // ctx.editMessageReplyMarkup();
    // ctx.editMessageText("Share location");
    // ctx.replyWithMarkdownV2

    /*
    bot.telegram.sendMessage(ctx.chat.id, "Share location", {
        reply_markyp: {
            remove_keyboard: true
        }
    }); 
    */
    
    ctx.reply("Welcome :)))))", {
        reply_markup: {
          keyboard: [[{ text: "Clicker ici pour ouvrir web app Telegram", web_app: { url: web_link } }]],
        },
    })

    /*
	return ctx.reply(
		"Thanks for sharing your location.",
	) */
})

  bot.on('callback_query', async (ctx) => {
    // Explicit usage
    await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  
    // Using context shortcut
    await ctx.answerCbQuery();
  });
  
  bot.on('inline_query', async (ctx) => {
    const result = [];
    // Explicit usage
    await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
  
    // Using context shortcut
    await ctx.answerInlineQuery(result);
  });




bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));






// https://www.youtube.com/playlist?list=PLX2ojSA27XYhIopdU2RRQIMe7gfwcKL84