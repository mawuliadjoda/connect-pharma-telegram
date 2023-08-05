"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const Util_1 = require("./Util");
const { PORT, TELEGRAM_TOKEN_PROD, TELEGRAM_TOKEN_DEV, SERVER_URL_PROD, SERVER_URL_DEV, ENVIRONMENT, WEB_LINK_NEAREST_PHARMACIES, WEB_LINK_REGISTER_PHARMACy } = process.env;
const SERVER_URL = ENVIRONMENT === 'dev' ? SERVER_URL_DEV : SERVER_URL_PROD;
const TELEGRAM_TOKEN = ENVIRONMENT === 'dev' ? TELEGRAM_TOKEN_DEV : TELEGRAM_TOKEN_PROD;
const MESSAGE_SHOW_NEAREST_PHARMACIES = "Pour voir les pharmacies proches, veuillez envoyer votre localisation";
const MESSAGE_REGISTER_PHARMACY = "Pour enregistrer une pharmacie, veuillez envoyer votre localisation";
const NEAREST_PHARMACIES = 'NEAREST_PHARMACIES';
const REGISTER_PHARMACY = 'REGISTER_PHARMACY';
if (TELEGRAM_TOKEN === undefined) {
    throw new TypeError("BOT_TOKEN must be provided!");
}
// Create your bot and tell it about your context type
const bot = new telegraf_1.Telegraf(TELEGRAM_TOKEN);
// Make session data available
bot.use((0, telegraf_1.session)());
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
    return ctx.reply(MESSAGE_SHOW_NEAREST_PHARMACIES, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.locationRequest("Envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
bot.command("Enregistrer_Pharmacie", ctx => {
    ctx.session = { messageCount: ctx.session.messageCount++, choice: REGISTER_PHARMACY };
    console.log(`context value: ${ctx.session}`);
    return ctx.reply(MESSAGE_REGISTER_PHARMACY, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.locationRequest("Envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
bot.on((0, filters_1.message)("location"), ctx => {
    console.log(ctx.session);
    const { latitude, longitude } = ctx.message.location;
    console.log({ latitude, longitude });
    const latitudeFr = (0, Util_1.convertToFRecimal)(latitude);
    const longitudeFr = (0, Util_1.convertToFRecimal)(longitude);
    console.log({ latitudeFr, longitudeFr });
    console.log(`${WEB_LINK_NEAREST_PHARMACIES}/${latitudeFr}/${longitudeFr}`);
    if (ctx.session.choice === NEAREST_PHARMACIES) {
        ctx.reply("Welcome :)))))", {
            reply_markup: {
                keyboard: [[{
                            text: "Clicker ici pour ouvrir web app Telegram",
                            web_app: { url: `${WEB_LINK_NEAREST_PHARMACIES}/${latitudeFr}/${longitudeFr}` }
                        }]],
            },
        });
    }
    else if (ctx.session.choice === REGISTER_PHARMACY) {
        console.log("process register new pharmacy");
        ctx.reply("Welcome :)))))", {
            reply_markup: {
                keyboard: [[{
                            text: "Clicker ici pour ouvrir web app Telegram",
                            web_app: { url: `${WEB_LINK_REGISTER_PHARMACy}/${latitudeFr}/${longitudeFr}` }
                        }]],
            },
        });
    }
});
bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit usage
    yield ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.first_name}`);
    // Using context shortcut
    yield ctx.reply(`Hello ${ctx.message.from.first_name}`);
}));
// Start webhook via launch method (preferred)
bot.launch({
    webhook: {
        domain: SERVER_URL,
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
//# sourceMappingURL=app.js.map