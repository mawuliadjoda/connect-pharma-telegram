

require('dotenv').config()
const { PORT, TELEGRAM_TOKEN, SERVER_URL, ENVIRONMENT } = process.env

const express = require('express')
const axios = require('axios');



// const qs = require('query-string')

// TinyPng Configuration
// const tinify = require('tinify')
// tinify.key = TINIFY_API_KEY

const app = express()

// const PORT = 4000

app.use(express.json())

app.get("/", (req, res) => {
    console.log(" ----- ");
})

/*
app.listen(PORT, () => {
    console.log(`Server is up and running on PORT ${PORT}`)
})
*/




// Telegram API Configuration
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`
const URI = `/webhook/${TELEGRAM_TOKEN}`
const webhookURL = `${SERVER_URL}${URI}`

const DOMAIN = `${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`;
// configuring the bot via Telegram API to use our route below as webhook
const setupWebhook = async () => {
    try {
        await axios.get(`${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`)
    } catch (error) {
        return error
    }
}

// setup our webhook url route
app.post(URI, (req, res) => {
    console.log(req.body);
    
    /* 
      we need to respond back with 200 to let telegram know that we 
      have received the update. Failing to do so will result in telegram 
      not sending further updates after the first one.
    */
    res.status(200).send('ok');
})

app.listen(PORT, async () => {
    // setting up our webhook url on server spinup
    try {
        console.log(`Server is up and Running at PORT : ${PORT}`)
        await setupWebhook()
    } catch (error) {
        console.log(error.message)
    } finally {
        console.log("final");
    }
})


console.log("fin");








// https://strapengine.com/telegram-bot-webhook-tutorial/
// https://dashboard.ngrok.com/get-started/your-authtoken