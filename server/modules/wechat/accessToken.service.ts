import { config } from "@app/config";
import * as CACHE from "@app/constants/cache.constant";
import { CacheIntervalResult, RedisServer } from "@app/processors/redis/redis.server";
import logger from "@app/utils/logger";
import { Injectable } from "@nestjs/common";
import { AccessToken, HttpKit } from 'tnwx'

type AccessTokenResult = AccessToken | undefined

@Injectable()
export class AccessTokenService {
    private url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wxConfig.appId}&secret=${config.wxConfig.appScrect}`
    private accessTokenCache: CacheIntervalResult<AccessTokenResult>
    constructor(
        private readonly cahcheService: RedisServer
    ) {
        this.accessTokenCache = this.cahcheService.interval({
            key: CACHE.CACHE_ACCESS_TOKEN,
            promise: this.refreshAccessToken,
            timeout: {
                success: 1000 * 60 * 60 * 2, // 成功后 2 个小时更新一次数据
                error: 5000, // 失败后 5 秒更新一次数据
            },
        })
    }

    /**
     * 获取asseccToken
     * @memberof AccessTokenService
     */
    public async getAccessToken() {
        const asseccToken: AccessTokenResult = await this.getAvailableAccessToken();
        if (asseccToken) {
            logger.info(`缓存中获取 asseccToken`)
            return asseccToken
        }
        logger.info('重新刷新asseccToken')
        return await this.refreshAccessToken()
    }

    /**
     * 获取缓存中的asseccToken
     * @return {*}  {Promise<AccessTokenResult>}
     * @memberof AccessTokenService
     */
    public async getAvailableAccessToken(): Promise<AccessTokenResult> {
        let result: AccessTokenResult
        const accessTokenJson = await this.accessTokenCache();
        if (accessTokenJson) {
            result = accessTokenJson;
        }
        if (result && result.isAvailable()) {
            return result;
        } else {
            return undefined;
        }
    }

    /**
     * 刷新asseccToken
     * @return {*}  {Promise<any>}
     * @memberof AccessTokenService
     */
    public async refreshAccessToken(): Promise<any> {
        const data = await HttpKit.getHttpDelegate.httpGet(this.url)
        if (data) {
            const accessToken: AccessToken = new AccessToken(data)
            return accessToken
        } else {
            new Error("获取accessToken异常");
        }
    }
}