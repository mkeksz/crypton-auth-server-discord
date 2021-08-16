const fetch = require('node-fetch')
const redis = require('redis')
const config = require('./config')

const redisClient = redis.createClient(config.REDIS_PORT, config.REDIS_HOST, {auth_pass: config.REDIS_AUTH_PATH})

module.exports.DiscordAuth =  async function (code, state) {
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
    if (!discord_id) throw new Error(user)

    const telegram_id = state
    const dataToSend = JSON.stringify({discord_id, telegram_id})
    console.info('Auth data:', dataToSend)
    redisClient.publish('discordAuth', dataToSend)
}
