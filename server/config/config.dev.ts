import { ConfigServer } from '@app/interfaces/config.interface'
import { redisConf } from '../dev.config'

const config: ConfigServer = {

    /* 接口请求相关配置 */
    requestTimeout: 300000,

    // 代理接口域名
    apiPrefix: {
        baseApi: 'http://172.25.197.154:3000',
    },

    redisConf: {
        'port': redisConf.port,
        'host': redisConf.host,
        'no_ready_check': true,
        'password': redisConf.password,
    },


    /* 微信相关配置 */
    wxOpenAppId: 'wxc2b795ed9de3592a',

}

module.exports = config;
