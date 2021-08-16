const redis = require('redis')
const fetch = require('node-fetch')
const express = require('express')
const config = require('./config')

const app = express()
const redisClient = redis.createClient(config.REDIS_HOST, config.REDIS_PORT, {auth_pass: config.REDIS_AUTH_PATH})

app.get('/', async ({query}, response) => {
    const {code, state} = query

    if (!code || !state) {
        const infoText = `Not found required query parameters!<br>Code: ${code}<br>State: ${state}`
        return response.send(infoText)
    }

    try {
        const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: config.CLIENT_ID,
                client_secret: config.CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: `http://${config.HOST}:${config.PORT}`,
                scope: 'identify',
                code
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const oauthData = await oauthResult.json()
        const userResult = await fetch('https://discord.com/api/users/@me', {
            headers: {authorization: `${oauthData['token_type']} ${oauthData['access_token']}`}
        })

        const user = await userResult.json()
        const discord_id = user['id']
        const telegram_id = state
        const dataToSend = JSON.stringify({discord_id, telegram_id})
        console.log(dataToSend, 'send to redis')
        redisClient.publish('discordAuth', dataToSend)
    } catch (error) {console.error(error)}
    return response.redirect(config.DISCORD_INVITE_LINK)
})

app.listen(config.PORT, () => console.log(`App listening at http://localhost:${config.PORT}`))
