import { createClient, ClientOpts } from 'redis'
import { CacheStoreFactory, CacheStoreSetOptions, CacheModuleOptions } from '@nestjs/common'

export type RedisStoreOptions = ClientOpts
export type RedisCacheStore = ReturnType<typeof createRedisStore>

export interface CacheStoreOptions extends CacheModuleOptions {
    redisOptions: RedisStoreOptions
}

const createRedisStore = (options: CacheStoreOptions) => {
    const client = createClient(options.redisOptions) as any

    const set = async <T>(key: string, value: T, options: CacheStoreSetOptions<T> = {}): Promise<void> => {
        const { ttl } = options
        const _value = value ? JSON.stringify(value) : ''
        if (ttl) {
            const _ttl = typeof ttl === 'function' ? ttl(value) : ttl
            await client.setEx(key, _ttl, _value)
        } else {
            await client.set(key, _value)
        }
    }

    const get = async <T>(key: string): Promise<T> => {
        const value = await client.get(key)
        return value ? JSON.parse(value) : value
    }

    const del = async (key: string) => {
        await client.del(key)
    }
    return { set, get, del, client }
}

const redisStoreFactory: CacheStoreFactory = {
    create: createRedisStore,
}

export default redisStoreFactory