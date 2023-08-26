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
// import { Location } from "telegraf/typings/core/types/typegram";
const { PORT, TELEGRAM_TOKEN_PROD, TELEGRAM_TOKEN_DEV, SERVER_URL_PROD, SERVER_URL_DEV, ENVIRONMENT, WEB_LINK_NEAREST_PHARMACIES, WEB_LINK_REGISTER_PHARMACy, } = process.env;
const SERVER_URL = ENVIRONMENT === 'dev' ? SERVER_URL_DEV : SERVER_URL_PROD;
const TELEGRAM_TOKEN = ENVIRONMENT === 'dev' ? TELEGRAM_TOKEN_DEV : TELEGRAM_TOKEN_PROD;
if (TELEGRAM_TOKEN === undefined) {
    throw new TypeError("BOT_TOKEN must be provided!");
}
// Create your bot and tell it about your context type
const bot = new telegraf_1.Telegraf(TELEGRAM_TOKEN);
// Make session data available
bot.use((0, telegraf_1.session)());
const ENREGISTRER_PHARMACIE_COMMAND = "enregistrer_pharmacie";
const PHARMACIE_PROCHE_COMMAND = "pharmacies_proches";
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session = (0, Util_1.initSession)();
    console.log(`context value: ${ctx.session}`);
    yield ctx.reply('<b>Bienvenue sur Connect Pharma !</b>', { parse_mode: 'HTML' });
    return ctx.reply(`\n<i>Bonjour ${ctx.message.from.first_name}, je suis un robot virtuelle qui vous assiste.</i> \nPour choisir une option, clickez sur un des boutons ci-dessous !`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Enregistrer Pharmacy", ENREGISTRER_PHARMACIE_COMMAND),
        telegraf_1.Markup.button.callback("Pharmacies Proches", PHARMACIE_PROCHE_COMMAND),
    ])));
}));
bot.action(PHARMACIE_PROCHE_COMMAND, ctx => {
    console.log(`session: ${ctx.session}`);
    ctx.session = ctx.session ? ctx.session : (0, Util_1.initSession)();
    ctx.session.messageCount = ctx.session.messageCount++;
    ctx.session.choice = ACTION_NEAREST_PHARMACIES;
    ctx.session.step = Util_1.STEP.SHARE_LOCATION;
    return ctx.reply(MESSAGE_SHOW_NEAREST_PHARMACIES, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.locationRequest("Clickez ici pour envoyer votre localisation"),
    ])
        .oneTime()
        .resize());
});
bot.action(ENREGISTRER_PHARMACIE_COMMAND, ctx => {
    ctx.session = ctx.session ? ctx.session : (0, Util_1.initSession)();
    ctx.session.messageCount++;
    ctx.session.choice = ACTION_REGISTER_PHARMACY;
    ctx.session.step = Util_1.STEP.SHARE_LOCATION;
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

bot.command(PHARMACIE_PROCHE_COMMAND, ctx => {
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

bot.command(ENREGISTRER_PHARMACIE_COMMAND, ctx => {
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
    ctx.session.step = Util_1.STEP.SHARE_CONTACT;
    console.log(ctx.session);
    yield ctx.reply(MESSAGE_SEND_CONTACT, telegraf_1.Markup.keyboard([
        telegraf_1.Markup.button.contactRequest("Clickez ici pour envoyer votre numero de tel"),
    ])
        .oneTime()
        .resize());
}));
bot.on((0, filters_1.message)("contact"), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.data.contact = ctx.message.contact.phone_number;
    console.log(ctx.session);
    switch (ctx.session.choice) {
        case ACTION_NEAREST_PHARMACIES:
            ctx.reply(MESSAGE_THANKS_FOR_SHARING_INFORMATION_CONTACT, {
                reply_markup: {
                    keyboard: [[{
                                text: "Clickez ici pour voir les pharmacies proches de vous !",
                                web_app: { url: `${WEB_LINK_NEAREST_PHARMACIES}/${ctx.session.data.latitude}/${ctx.session.data.longitude}/${ctx.session.data.contact}` }
                            }]],
                },
            });
            break;
        case ACTION_REGISTER_PHARMACY:
            console.log("process register new pharmacy");
            console.log(`${WEB_LINK_REGISTER_PHARMACy}/${ctx.session.data.latitude}/${ctx.session.data.longitude}/${ctx.session.data.contact}`);
            ctx.reply(MESSAGE_THANKS_FOR_SHARING_INFORMATION_CONTACT, {
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
        step: Util_1.STEP.INIT,
        data: { latitude: '', longitude: '', contact: '' }
    };
    console.log(`web_app_data :${ctx.message}`);
    return ctx.reply(`\n<i>Rebonjour ${ctx.message.from.first_name}, </i> \nPour choisir une option, clickez sur un des boutons ci-dessous !`, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Enregistrer Pharmacy", ENREGISTRER_PHARMACIE_COMMAND),
        telegraf_1.Markup.button.callback("Pharmacies Proches", PHARMACIE_PROCHE_COMMAND),
    ])));
}));
bot.on((0, filters_1.message)('web_app_data'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // bot.on('web_app_data', async (ctx) => {
    // var [timespamp, timezoneOffset] = ctx.message.web_app_data.data.split('_')
    console.log(ctx.message.web_app_data.data);
    // await ctx.reply(ctx.message.web_app_data.data);
    // ctx.reply(`<b>Veuillez créer votre compte: \n https://connect-pharma-911ea.web.app/auth/register !</b>`, { parse_mode: 'HTML' });
    const data = JSON.parse(ctx.message.web_app_data.data);
    console.log(data.message);
    const email = data.email;
    console.log(email);
    console.log(email.replaceAll(`.`, `,`));
    console.log('build ok mawuli');
    switch (data.step) {
        case Util_1.WebAppDataStep.CREATE_ACOUNT:
            yield ctx.reply(data.message, {
                reply_markup: {
                    keyboard: [[{
                                text: "Clickez ici pour créer un compte dans notre système! \nCeci vous permettra de vous connecter",
                                web_app: { url: `https://connect-pharma-911ea.web.app/auth/register/${ctx.session.data.contact}/${data.email.replaceAll(`.`, `,`)}` }
                            }]],
                },
            });
            break;
        case Util_1.WebAppDataStep.LOGIN:
            yield ctx.reply(data.message);
            ctx.reply(`<b>Vous pouvez vous connecter sur ce lien: \n ${data.frontendUrl} </b>`, { parse_mode: 'HTML' });
            break;
        default:
            break;
    }
    // ctx.telegram.sendMessage('33678590574', `Hello ${ctx.state.role}`);
}));
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
const MESSAGE_SHOW_NEAREST_PHARMACIES = "Pour voir les pharmacies proches de vous , veuillez envoyer votre localisation";
const MESSAGE_SEND_CONTACT = "Comment pouvons-nous vous contactez ? \n Merci de nous envoyer votre Numero de Tel:";
const MESSAGE_REGISTER_PHARMACY = "Pour enregistrer votre pharmacie dans notre système, veuillez envoyer votre localisation";
const MESSAGE_THANKS_FOR_SHARING_INFORMATION_CONTACT = 'Merci, nous avons bien reçu vos informations !';
const ACTION_NEAREST_PHARMACIES = 'NEAREST_PHARMACIES';
const ACTION_REGISTER_PHARMACY = 'REGISTER_PHARMACY';
//# sourceMappingURL=app.js.map