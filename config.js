const dotenv = require('dotenv')
dotenv.config()

const config = {
    REDIS_HOST: process.env['REDIS_HOST'],
    REDIS_PORT: process.env['REDIS_PORT'],
    REDIS_AUTH_PATH: process.env['REDIS_AUTH_PASS'],
    DISCORD_INVITE_LINK: process.env['DISCORD_INVITE_LINK'],
    OAUTH2_CLIENT_ID: process.env['OAUTH2_CLIENT_ID'],
    OAUTH2_CLIENT_SECRET: process.env['OAUTH2_CLIENT_SECRET'],
    OAUTH2_REDIRECT_URI: process.env['OAUTH2_REDIRECT_URI'],
    SSL_CERTIFICATE: process.env['SSL_CERTIFICATE'],
    SSL_PRIVATE_KEY: process.env['SSL_PRIVATE_KEY']
}

module.exports = config
