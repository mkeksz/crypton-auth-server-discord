const dotenv = require('dotenv')
dotenv.config()

const config = {
    REDIS_HOST: process.env['REDIS_HOST'],
    REDIS_PORT: process.env['REDIS_PORT'],
    REDIS_AUTH_PATH: process.env['REDIS_AUTH_PATH'],
    CLIENT_ID: process.env['CLIENT_ID'],
    CLIENT_SECRET: process.env['CLIENT_SECRET'],
    PORT: process.env['PORT'],
    HOST: process.env['HOST'],
    DISCORD_INVITE_LINK: process.env['DISCORD_INVITE_LINK']
}

module.exports = config
