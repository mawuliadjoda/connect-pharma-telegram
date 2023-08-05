/*
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!! Bienvenue Mawuli');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
*/
// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
// import express from 'express';
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
const { PORT, TELEGRAM_TOKEN_PROD, TELEGRAM_TOKEN_DEV, SERVER_URL_PROD, SERVER_URL_DEV, ENVIRONMENT, WEB_LINK_NEAREST_PHARMACIES, WEB_LINK_REGISTER_PHARMACy } = process.env;
const SERVER_URL = ENVIRONMENT === 'dev' ? SERVER_URL_DEV : SERVER_URL_PROD;
const TELEGRAM_TOKEN = ENVIRONMENT === 'dev' ? TELEGRAM_TOKEN_DEV : TELEGRAM_TOKEN_PROD;
const MESSAGE_SHOW_NEAREST_PHARMACIES = "Pour voir les pharmacies proches, veuillez envoyer votre localisation";
const MESSAGE_REGISTER_PHARMACY = "Pour enregistrer une pharmacie, veuillez envoyer votre localisation";
/*
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World!! Bienvenue Mawuli');
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
*/
const bot = new Telegraf(TELEGRAM_TOKEN);
bot.start((ctx) => {
    ctx.reply('Bienvenue ! \n Connect Pharma \n Choisir une option clickez ci-dessous');
    ctx.reply(`1: /Pharmacies_Proches \n  \n 2: /Enregistrer_Pharmacie \n`);
});
bot.command("Pharmacies_Proches", ctx => {
    // session.set
    return ctx.reply(MESSAGE_SHOW_NEAREST_PHARMACIES, Markup.keyboard([
        Markup.button.locationRequest("Envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
bot.command("Enregistrer_Pharmacie", ctx => {
    // ctx.session.walletData = 'Enregistrer_Pharmacie';
    return ctx.reply(MESSAGE_REGISTER_PHARMACY, Markup.keyboard([
        Markup.button.locationRequest("Envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('hipster', Telegraf.reply('λ'));
bot.command("location", ctx => {
    return ctx.reply("Please share your location", Markup.keyboard([
        Markup.button.locationRequest("Share location"),
    ])
        .oneTime()
        .resize());
});
bot.on(message("location"), ctx => {
    console.log(ctx);
    /*
    const reply_msg = ctx.message.reply_to_message?.message_id
    const reply_to_message = (ctx.update.message && ctx.update.message?.reply_to_message) ? ctx.update.message?.reply_to_message : "";
      const { latitude, longitude } = ctx.message.location
  
        console.log({ latitude, longitude });
      const latitudeFr = convertToFRecimal(latitude);
      const longitudeFr = convertToFRecimal(longitude);
  
      console.log({ latitudeFr, longitudeFr })
      console.log(`${WEB_LINK_NEAREST_PHARMACIES}/${latitudeFr}/${longitudeFr}`);
  
      if(reply_to_message.valueOf() === MESSAGE_SHOW_NEAREST_PHARMACIES) {
        ctx.reply("Welcome :)))))", {
            reply_markup: {
              keyboard: [[{
                 text: "Clicker ici pour ouvrir web app Telegram",
                 web_app: { url: `${WEB_LINK_NEAREST_PHARMACIES}/${latitudeFr}/${longitudeFr}` }
                }]],
            },
        })
      } else if (reply_to_message.valueOf() === MESSAGE_REGISTER_PHARMACY){
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
      */
});
bot.on(message('text'), (ctx) => __awaiter(this, void 0, void 0, function* () {
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
// https://www.npmjs.com/package/telegraf
function convertToFRecimal(value) {
    const valueString = String(value);
    if (!(valueString === null || valueString === void 0 ? void 0 : valueString.includes(".")))
        return valueString;
    const latTab = valueString === null || valueString === void 0 ? void 0 : valueString.split(".");
    const decimalPart = latTab ? latTab[0] : 0;
    const floatingPart = latTab ? latTab[1] : 0;
    return `${decimalPart},${floatingPart}`;
}
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=app.js.map