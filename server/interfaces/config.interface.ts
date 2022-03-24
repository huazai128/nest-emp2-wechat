export interface ConfigServer {
    requestTimeout: number
    userId?: string
    apiPrefix: {
        baseApi: string,
    }
    redisConf: {
        port: number,
        host: string,
        no_ready_check: boolean,
        password: string,
        defaultCacheTTL?: number
        username?: string
    }
    wxConfig: {
        appId: string
        appScrect: string
        token: string
        encryptMessage: boolean,
        encodingAesKey: string
        domain: string
        authAppId: string
    }
}
