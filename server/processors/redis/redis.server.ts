import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { RedisCacheStore } from "./redis.store";
import { Cache } from 'cache-manager'
import logger from "@app/utils/logger";

@Injectable()
export class RedisServer {
    public cacheStore!: RedisCacheStore
    private isReadied = false

    constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
        this.cacheStore = cacheManager.store as RedisCacheStore
        this.cacheStore.client.on('connect', () => {
            logger.info('[Redis]', 'connecting...')
        })
        this.cacheStore.client.on('reconnecting', () => {
            logger.warn('[Redis]', 'reconnecting...')
        })
        this.cacheStore.client.on('ready', () => {
            this.isReadied = true
            logger.info('[Redis]', 'readied!')
        })
        this.cacheStore.client.on('end', () => {
            this.isReadied = false
            logger.error('[Redis]', 'Client End!')
        })
        this.cacheStore.client.on('error', (error) => {
            this.isReadied = false
            logger.error('[Redis]', `Client Error!`, error.message)
        })
    }
}