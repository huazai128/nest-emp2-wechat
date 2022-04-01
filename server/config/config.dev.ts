import { ConfigServer } from '@app/interfaces/config.interface'
import { redisConf, wxConfig } from '../dev.config'

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
    wxConfig: {
        appId: wxConfig.appId,
        appScrect: wxConfig.appScrect,
        token: 'mima-wx',
        encryptMessage: true,
        encodingAesKey: 'encodingAesKey',
        domain: 'https:// ',
        authAppId: ''
    }

}

module.exports = config;
