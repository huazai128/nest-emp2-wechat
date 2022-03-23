import { ConfigParams } from "@src/interfaces/config"

const env = process.env.EMP_ENV || 'dev'

const config: ConfigParams = require(`./config.${env}`).default

export default {
    ...config,
    env
} as ConfigParams & { env: string }