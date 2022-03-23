import { REDIS } from '@app/config'
import logger from '@app/utils/logger'
import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common'
import redisStore, { RedisStoreOptions } from './redis.store'

@Injectable()
export class RedisConfigServer implements CacheOptionsFactory {
    // 重试策略
    private retryStrategy(retries: number): number | Error {
        const errorMessage = ['[Redis]', `retryStrategy！retries: ${retries}`]
        logger.error(...(errorMessage as [any]))
        if (retries > 6) {
            return new Error('[Redis] 尝试次数已达极限！')
        }
        return Math.min(retries * 1000, 3000)
    }

    public createCacheOptions(): CacheModuleOptions<Record<string, any>> | Promise<CacheModuleOptions<Record<string, any>>> {
        const redisOptions: RedisStoreOptions = {
            host: REDIS.host as string,
            port: REDIS.port as number,
            retry_strategy: this.retryStrategy.bind(this),
        }
        if (REDIS.password) {
            redisOptions.password = REDIS.password
        }
        return {
            isGlobal: true,
            store: redisStore,
            redisOptions,
        }
    }
}