import { resolve } from 'path'
import { environment } from '@app/app.env'
import { ConfigServer } from '@app/interfaces/config.interface'
import session from 'express-session'

const conf = require(resolve(__dirname, `./config.${environment}`))

export const config: ConfigServer = conf

export const APP = {
    PORT: 3002,
    DEFAULT_CACHE_TTL: 60 * 60 * 24,
}

export const CROSS_DOMAIN = {
    allowedOrigins: ['https://admin-test.markiapp.com', 'https://admin.markiapp.com', 'https://admin-release.markiapp.com'],
    allowedReferer: 'markiapp.com',
}

export const REDIS = {
    host: config.redisConf.host,
    port: config.redisConf.port,
    username: config.redisConf.username,
    password: config.redisConf.password,
}

export const COOKIE_KEY = '@get-cookie-1212-dffas'

// session 配置
export const SESSION: session.SessionOptions = {
    secret: 'sup3rs3cr3t',
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: true,
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
}


export const AUTH = {
    jwtTokenSecret: 'nest_emp_ssr',
    expiresIn: 3600,
}