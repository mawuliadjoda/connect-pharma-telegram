//  https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript

require('dotenv').config()
import { Context, session, Telegraf, Markup } from "telegraf";
import { message } from 'telegraf/filters';
import { convertToFRecimal } from "./Util";
import { Location } from "telegraf/typings/core/types/typegram";


const { PORT,
    TELEGRAM_TOKEN_PROD,
    TELEGRAM_TOKEN_DEV,
    SERVER_URL_PROD,
    SERVER_URL_DEV,
    ENVIRONMENT,
    WEB_LINK_NEAREST_PHARMACIES,
    WEB_LINK_REGISTER_PHARMACy,
    
} = process.env
const SERVER_URL = ENVIRONMENT === 'dev' ? SERVER_URL_DEV : SERVER_URL_PROD;
const TELEGRAM_TOKEN = ENVIRONMENT === 'dev' ? TELEGRAM_TOKEN_DEV! : TELEGRAM_TOKEN_PROD!;


enum STEP {
    INIT = 'INIT',
    SHARE_LOCATION = 'SHARE_LOCATION',
    SHARE_CONTACT = 'SHARE_CONTACT',
}

interface SessionData {
    messageCount: number;
    choice: string;
    step: STEP,
    data: {
        latitude: string,
        longitude: string,
        contact: string
    }
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


bot.start(async ctx => {
    ctx.session = {
        messageCount: 0,
        choice: '',
        step: STEP.INIT,
        data: { latitude: '', longitude: '', contact: '' }
    };
    console.log(`context value: ${ctx.session}`);

    await ctx.reply('<b>Bienvenue sur Connect Pharma !</b>', { parse_mode: 'HTML' });
    return ctx.reply(`\n<i>Bonjour ${ctx.message.from.first_name}, je suis un robot virtuelle qui vous assiste.</i> \nPour choisir une option, clickez sur un des boutons ci-dessous !`, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            Markup.button.callback("Enregistrer Pharmacy", "Enregistrer_Pharmacie"),
            Markup.button.callback("Pharmacies Proches", "Pharmacies_Proches"),
        ]),
    });
});


bot.action("Pharmacies_Proches", ctx => {

    ctx.session.messageCount++;
    ctx.session.choice = ACTION_NEAREST_PHARMACIES;
    ctx.session.step = STEP.SHARE_LOCATION;

    return ctx.reply(
        MESSAGE_SHOW_NEAREST_PHARMACIES,
        Markup.keyboard([
            Markup.button.locationRequest("Clickez ici pour envoyer votre localisation"),
        ])
            
            .oneTime()
            .resize()
        ,
    )
});

bot.action("Enregistrer_Pharmacie", ctx => {
    ctx.session.messageCount++;
    ctx.session.choice = ACTION_REGISTER_PHARMACY;
    ctx.session.step = STEP.SHARE_LOCATION;
    return ctx.reply(
        MESSAGE_REGISTER_PHARMACY,
        Markup.keyboard([
            Markup.button.locationRequest("Clickez ici pour envoyer votre localisation"),
        ])
            .oneTime()
            .resize()
        ,
    )
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


bot.on(message("location"), async ctx => {  
    const { latitude, longitude } = ctx.message.location

    ctx.session.data.latitude = convertToFRecimal(latitude);
    ctx.session.data.longitude = convertToFRecimal(longitude);
    ctx.session.step = STEP.SHARE_CONTACT;

    console.log(ctx.session);

    await ctx.reply(
        MESSAGE_SEND_CONTACT,
        Markup.keyboard([
            Markup.button.contactRequest("Clickez ici pour envoyer votre numero de tel"),
        ])
            .oneTime()
            .resize()
        ,
    );
})

bot.on(message("contact"), async ctx => {

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
            })
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
            })
            break;

        default:
            break;
    }

});

bot.on(message('text'), async (ctx) => {
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
    console.log(`web_app_data :${ctx.message}`)
    return ctx.reply(`\n<i>Rebonjour ${ctx.message.from.first_name}, </i> \nPour choisir une option, clickez sur un des boutons ci-dessous !`, {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
            Markup.button.callback("Enregistrer Pharmacy", "Enregistrer_Pharmacie"),
            Markup.button.callback("Pharmacies Proches", "Pharmacies_Proches"),
        ]),
    });
});

type WebAppData = {
    message: string,
    email: string,
    tel: string,
    hasEmail: boolean
}
bot.on('web_app_data', async (ctx) => {
    // var [timespamp, timezoneOffset] = ctx.message.web_app_data.data.split('_')
    console.log(ctx.message.web_app_data.data);
    // await ctx.reply(ctx.message.web_app_data.data);
    // ctx.reply(`<b>Veuillez créer votre compte: \n https://connect-pharma-911ea.web.app/auth/register !</b>`, { parse_mode: 'HTML' });

    const data: WebAppData = JSON.parse(ctx.message.web_app_data.data);
    
    console.log(data.message);

    ctx.reply(data.message, {
        reply_markup: {
            keyboard: [[{
                        text: "Clickez ici pour créer un compte dans notre système! \nCeci vous permettra de vous connecter",
                        web_app: { url: `https://connect-pharma-911ea.web.app/auth/register/${ctx.session.data.contact}/${data.hasEmail}` }
                    }]],
        },
    });

    // ctx.telegram.sendMessage('33678590574', `Hello ${ctx.state.role}`);
})

bot.on("message", async (ctx) => {
    console.log(`web_app_data :${ctx.message}`)
    return ctx.reply(ctx.message.from.first_name)

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

// https://github.com/feathers-studio/telegraf-docs/blob/master/examples/session-bot.ts
// https://fr.javascript.info/async-await



const MESSAGE_SHOW_NEAREST_PHARMACIES = "Pour voir les pharmacies proches de vous , veuillez envoyer votre localisation";
const MESSAGE_SEND_CONTACT = "Comment pouvons-nous vous contactez ? \n Merci de nous envoyer votre Numero de Tel:";
const MESSAGE_REGISTER_PHARMACY = "Pour enregistrer votre pharmacie dans notre système, veuillez envoyer votre localisation";
const MESSAGE_THANKS_FOR_SHARING_INFORMATION_CONTACT = 'Merci, nous avons bien reçu vos informations !';

const ACTION_NEAREST_PHARMACIES = 'NEAREST_PHARMACIES';
const ACTION_REGISTER_PHARMACY = 'REGISTER_PHARMACY';