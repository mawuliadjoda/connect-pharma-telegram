"use strict";
//  https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
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
const MESSAGE_SHOW_NEAREST_PHARMACIES = "Pour voir les pharmacies proches de vous , veuillez envoyer votre localisation";
const MESSAGE_SEND_CONTACT = "Veuillez envoyer votre contact ";
const MESSAGE_REGISTER_PHARMACY = "Pour enregistrer votre pharmacie dans notre système, veuillez envoyer votre localisation";
const THANKS_FOR_SHARING_LOCATION_MESSAGE = 'Merci, nous avons bien reçu votre localisation';
const NEAREST_PHARMACIES = 'NEAREST_PHARMACIES';
const REGISTER_PHARMACY = 'REGISTER_PHARMACY';
var STEP;
(function (STEP) {
    STEP["INIT"] = "INIT";
    STEP["SHARE_LOCATION"] = "SHARE_LOCATION";
    STEP["SHARE_CONTACT"] = "SHARE_CONTACT";
})(STEP || (STEP = {}));
if (TELEGRAM_TOKEN === undefined) {
    throw new TypeError("BOT_TOKEN must be provided!");
}
// Create your bot and tell it about your context type
const bot = new telegraf_1.Telegraf(TELEGRAM_TOKEN);
// Make session data available
bot.use((0, telegraf_1.session)());
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session = {
        messageCount: 0,
        choice: '',
        step: STEP.INIT,
        data: { latitude: '', longitude: '', contact: '' }
    };
    console.log(`context value: ${ctx.session.messageCount}`);
    yield ctx.reply('<b>Bienvenue sur Connect Pharma !</b>', { parse_mode: 'HTML' });
    return ctx.reply(`\n<i>Bonjour ${ctx.message.from.first_name}, je suis un robot virtuelle qui vous assiste.</i> \nPour choisir une option, clickez sur un des boutons ci-dessous !`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Enregistrer Pharmacy", "Enregistrer_Pharmacie"),
        telegraf_1.Markup.button.callback("Pharmacies Proches", "Pharmacies_Proches"),
    ])));
}));
bot.action("Pharmacies_Proches", ctx => {
    ctx.session.messageCount++;
    ctx.session.choice = NEAREST_PHARMACIES;
    ctx.session.step = STEP.SHARE_LOCATION;
    return ctx.reply(MESSAGE_SHOW_NEAREST_PHARMACIES, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.locationRequest("Clickez ici pour envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
bot.action("Enregistrer_Pharmacie", ctx => {
    ctx.session.messageCount++;
    ctx.session.choice = REGISTER_PHARMACY;
    ctx.session.step = STEP.SHARE_LOCATION;
    return ctx.reply(MESSAGE_REGISTER_PHARMACY, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.locationRequest("Clickez ici pour envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
/*

bot.start(async ctx => {
    ctx.session = { messageCount: 0, choice: '' };
    ctx.session.messageCount++;
    console.log(`context value: ${ctx.session.messageCount}`);
    await ctx.reply('Bienvenue ! \n Connect Pharma \n Choisir une option clickez ci-dessous');
    ctx.reply(`1: /Pharmacies_Proches \n\n  \n 2: /Enregistrer_Pharmacie \n`);

});

bot.command("Pharmacies_Proches", ctx => {
    ctx.session = { messageCount: ctx.session.messageCount++, choice: NEAREST_PHARMACIES };
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
*/
bot.on((0, filters_1.message)("location"), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude } = ctx.message.location;
    ctx.session.data.latitude = (0, Util_1.convertToFRecimal)(latitude);
    ctx.session.data.longitude = (0, Util_1.convertToFRecimal)(longitude);
    ctx.session.step = STEP.SHARE_CONTACT;
    console.log(ctx.session);
    yield ctx.reply(MESSAGE_SEND_CONTACT, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.contactRequest("Clickez ici pour envoyer votre numero de tel"),
    ])
        .oneTime()
        .resize());
}));
bot.on((0, filters_1.message)("contact"), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("session" + ctx.session);
    ctx.session.data.contact = ctx.message.contact.phone_number;
    switch (ctx.session.choice) {
        case NEAREST_PHARMACIES:
            ctx.reply(THANKS_FOR_SHARING_LOCATION_MESSAGE, {
                reply_markup: {
                    keyboard: [[{
                                text: "Clickez ici pour voir les pharmacies proches de vous !",
                                web_app: { url: `${WEB_LINK_NEAREST_PHARMACIES}/${ctx.session.data.latitude}/${ctx.session.data.longitude}/${ctx.session.data.contact}` }
                            }]],
                },
            });
            break;
        case REGISTER_PHARMACY:
            console.log("process register new pharmacy");
            console.log(`${WEB_LINK_REGISTER_PHARMACy}/${ctx.session.data.latitude}/${ctx.session.data.longitude}/${ctx.session.data.contact}`);
            ctx.reply(THANKS_FOR_SHARING_LOCATION_MESSAGE, {
                reply_markup: {
                    keyboard: [[{
                                text: "Clickez ici pour enregistrer votre pharmacie !",
                                web_app: { url: `${WEB_LINK_REGISTER_PHARMACy}/${ctx.session.data.latitude}/${ctx.session.data.longitude}/${ctx.session.data.contact}` }
                            }]],
                },
            });
            break;
        default:
            break;
    }
}));
bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit usage
    // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.from.first_name}`);
    // Using context shortcut
    // await ctx.reply(`Hello ${ctx.message.from.first_name}`);
    ctx.session = {
        messageCount: 0,
        choice: '',
        step: STEP.INIT,
        data: { latitude: '', longitude: '', contact: '' }
    };
    console.log(`web_app_data :${ctx.message}`);
    return ctx.reply(`\n<i>Rebonjour ${ctx.message.from.first_name}, </i> \nPour choisir une option, clickez sur un des boutons ci-dessous !`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Enregistrer Pharmacy", "Enregistrer_Pharmacie"),
        telegraf_1.Markup.button.callback("Pharmacies Proches", "Pharmacies_Proches"),
    ])));
}));
bot.on('web_app_data', (ctx) => {
    var [timespamp, timezoneOffset] = ctx.message.web_app_data.data.split('_');
    console.log(ctx.message.web_app_data.data);
    ctx.telegram.sendMessage('33678590574', `Hello ${ctx.state.role}`);
});
bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`web_app_data :${ctx.message}`);
    return ctx.reply(ctx.message.from.first_name);
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
// https://github.com/feathers-studio/telegraf-docs/blob/master/examples/session-bot.ts
// https://fr.javascript.info/async-await
//# sourceMappingURL=app.js.map