require('dotenv').config()

import { Context, session, Telegraf, Markup } from "telegraf";
import { message } from 'telegraf/filters';
import { convertToFRecimal } from "./Util";


const { PORT,
    TELEGRAM_TOKEN_PROD,
    TELEGRAM_TOKEN_DEV,
    SERVER_URL_PROD,
    SERVER_URL_DEV,
    ENVIRONMENT,
    WEB_LINK_NEAREST_PHARMACIES,
    WEB_LINK_REGISTER_PHARMACy
} = process.env
const SERVER_URL = ENVIRONMENT === 'dev' ? SERVER_URL_DEV : SERVER_URL_PROD;
const TELEGRAM_TOKEN = ENVIRONMENT === 'dev' ? TELEGRAM_TOKEN_DEV! : TELEGRAM_TOKEN_PROD!;

const MESSAGE_SHOW_NEAREST_PHARMACIES = "Pour voir les pharmacies proches, veuillez envoyer votre localisation";
const MESSAGE_REGISTER_PHARMACY = "Pour enregistrer une pharmacie, veuillez envoyer votre localisation";

const NEAREST_PHARMACIES = 'NEAREST_PHARMACIES';
const REGISTER_PHARMACY = 'REGISTER_PHARMACY';

interface SessionData {
    messageCount: number;
    choice: string;
    // ... more session data go here
}

// Define your own context type
interface MyContext extends Context {
    session?: SessionData;
    // ... more props go here
}

if (TELEGRAM_TOKEN === undefined) {
    throw new TypeError("BOT_TOKEN must be provided!");
}

// Create your bot and tell it about your context type
const bot = new Telegraf<MyContext>(TELEGRAM_TOKEN);

// Make session data available
bot.use(session());

// Register middleware
/*
bot.on("message", async ctx => {
    // set a default value
    ctx.session ??= { messageCount: 0 };
    ctx.session.messageCount++;
    await ctx.reply(`Seen ${ctx.session.messageCount} messages.`);
});
*/
bot.start((ctx) => {
    ctx.session = { messageCount: 0, choice: '' };
    ctx.session.messageCount++;
    console.log(`context value: ${ctx.session.messageCount}`);
    ctx.reply('Bienvenue ! \n Connect Pharma \n Choisir une option clickez ci-dessous');
    ctx.reply(`1: /Pharmacies_Proches \n  \n 2: /Enregistrer_Pharmacie \n`);

});

bot.command("Pharmacies_Proches", ctx => {
    ctx.session = { messageCount: ctx.session.messageCount++, choice: NEAREST_PHARMACIES };
    console.log(`context value: ${ctx.session}`);
    return ctx.reply(
        MESSAGE_SHOW_NEAREST_PHARMACIES,
        Markup.keyboard([
            Markup.button.locationRequest("Envoyer votre localisation"),
        ])
            .oneTime()
            .resize()
        ,
    )
})

bot.command("Enregistrer_Pharmacie", ctx => {
    ctx.session = { messageCount: ctx.session.messageCount++, choice: REGISTER_PHARMACY };
    console.log(`context value: ${ctx.session}`);
    return ctx.reply(
        MESSAGE_REGISTER_PHARMACY,
        Markup.keyboard([
            Markup.button.locationRequest("Envoyer votre localisation"),
        ])
            .oneTime()
            .resize()
        ,
    )
})


bot.on(message("location"), ctx => {
    console.log(ctx.session);


    const { latitude, longitude } = ctx.message.location

    console.log({ latitude, longitude });
    const latitudeFr = convertToFRecimal(latitude);
    const longitudeFr = convertToFRecimal(longitude);

    console.log({ latitudeFr, longitudeFr })
    console.log(`${WEB_LINK_NEAREST_PHARMACIES}/${latitudeFr}/${longitudeFr}`);

    if (ctx.session.choice === NEAREST_PHARMACIES) {
        ctx.reply("Welcome :)))))", {
            reply_markup: {
                keyboard: [[{
                    text: "Clicker ici pour ouvrir web app Telegram",
                    web_app: { url: `${WEB_LINK_NEAREST_PHARMACIES}/${latitudeFr}/${longitudeFr}` }
                }]],
            },
        })
    } else if (ctx.session.choice === REGISTER_PHARMACY) {
        console.log("process register new pharmacy")
        ctx.reply("Welcome :)))))", {
            reply_markup: {
                keyboard: [[{
                    text: "Clicker ici pour ouvrir web app Telegram",
                    web_app: { url: `${WEB_LINK_REGISTER_PHARMACy}/${latitudeFr}/${longitudeFr}` }
                }]],
            },
        })
    }
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
        domain: SERVER_URL!,
        port: Number(PORT)
    },
})
    .then(() => {
        console.log("Webhook bot listening on port", PORT);
    })
    .catch(() => {
        console.error("Error while lanch Webhook ");
    });


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));