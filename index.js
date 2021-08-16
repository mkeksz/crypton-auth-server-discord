const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const config = require('./config')
const {DiscordAuth} = require('./discordAuth')

const app = express()

app.get('/', async ({query}, response) => {
    const {code, state} = query

    if (!code || !state) {
        const infoText = `Not found required query parameters!<br>Code: ${code}<br>State: ${state}`
        return response.send(infoText)
    }

    try {
        await DiscordAuth(code, state)
    } catch (error) {
        console.error(error)
        return response.send('Unknown Error')
    }
    return response.redirect(config.DISCORD_INVITE_LINK)
})

const httpServer = http.createServer(app)
httpServer.listen(8080)

if (config.SSL_CERTIFICATE && config.SSL_PRIVATE_KEY) {
    const privateKey  = fs.readFileSync(config.SSL_PRIVATE_KEY, 'utf8')
    const certificate = fs.readFileSync(config.SSL_CERTIFICATE, 'utf8')
    const credentials = {cert: certificate, key: privateKey}
    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(443)
}

console.info(`Launched`)
