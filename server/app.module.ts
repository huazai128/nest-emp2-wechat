import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// redis and session
import { RedisModule } from '@app/processors/redis/redis.module';
import { RedisServer } from '@app/processors/redis/redis.server';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SESSION } from '@app/config';
import RedisStore from 'connect-redis';
import session from 'express-session';

// http
import { AxiosModule } from '@app/processors/axios/axios.module';

// middlewares
import { CorsMiddleware } from '@app/middlewares/core.middleware';
import { OriginMiddleware } from '@app/middlewares/origin.middleware';

// API 
import { ApiModule } from '@app/modules/api/api.module';

// Auth
import { AuthModule } from '@app/modules/auth/auth.module'

// Router 
import { RouterModule } from '@app/modules/router/router.module';


@Module({
    imports: [
        RedisModule,
        AxiosModule,

        ApiModule,
        AuthModule,
        RouterModule
    ],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule implements NestModule {
    private redis: any
    constructor(private readonly redisStore: RedisServer) {
        this.redis = this.redisStore.cacheStore.client
    }
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                CorsMiddleware,
                OriginMiddleware,
                session({
                    store: new (RedisStore(session))({ client: this.redis }),
                    ...SESSION
                }),
            )
            .forRoutes('*');
    }
}
