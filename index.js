const redis = require('redis')
const fs = require('fs')
const http = require('http')
const https = require('https')
const fetch = require('node-fetch')
const express = require('express')
const config = require('./config')

const redisClient = redis.createClient(config.REDIS_PORT, config.REDIS_HOST, {auth_pass: config.REDIS_AUTH_PATH})
const app = express()

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
                client_id: config.OAUTH2_CLIENT_ID,
                client_secret: config.OAUTH2_CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: config.OAUTH2_REDIRECT_URI,
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
        console.info('Auth data:', dataToSend)
        redisClient.publish('discordAuth', dataToSend)
    } catch (error) {console.error(error)}
    return response.redirect(config.DISCORD_INVITE_LINK)
})

const httpServer = http.createServer(app)
httpServer.listen(8080)
console.info(`Launched`)

if (config.SSL_CERTIFICATE && config.SSL_PRIVATE_KEY) {
    const privateKey  = fs.readFileSync(config.SSL_PRIVATE_KEY, 'utf8')
    const certificate = fs.readFileSync(config.SSL_CERTIFICATE, 'utf8')
    const credentials = {cert: certificate, key: privateKey}
    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(443)
}
