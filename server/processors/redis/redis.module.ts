import { CacheModule as NestCacheModule, Global, Module } from '@nestjs/common'
import { RedisConfigServer } from './redis.config.server';
import { RedisServer } from './redis.server';

/**
 * Redis
 * @export
 * @class RedisModule
 */
@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            useClass: RedisConfigServer,
            inject: [RedisConfigServer]
        })
    ],
    providers: [RedisConfigServer, RedisServer],
    exports: [RedisServer]
})

export class RedisModule { }