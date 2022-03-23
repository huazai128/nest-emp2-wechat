import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getServerIp } from '@app/utils/util';
import { join, resolve } from 'path';
import { isDevEnv } from '@app/app.env';
import { Request } from 'express';
import { get } from 'lodash'

import { COOKIE_KEY, APP } from '@app/config';
import { AppModule } from '@app/app.module';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '@app/filters/error.filter';

import logger from '@app/utils/logger';
import bodyParser from 'body-parser'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import ejs from 'ejs'


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(resolve(__dirname, '../../dist/client'))

    // 这里是单页应用
    // app.setBaseViewsDir(join(__dirname, '../..', 'views'));
    app.setBaseViewsDir(join(__dirname, '../../dist/views'));
    app.setViewEngine('html');
    app.engine('html', ejs.renderFile);

    app.use(compression())
    app.use(bodyParser.json({ limit: '1mb' }))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }))
    app.use(cookieParser(COOKIE_KEY))

    morgan.token('userId', (req: Request) => {
        return get(req, 'cookies.userId') || get(req, 'session.user.userId') || ''
    })
    app.use(morgan(':remote-addr - [:userId] - :remote-user ":method :url HTTP/:http-version" ":referrer" ":user-agent" :status :res[content-length] - :response-time ms'))

    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor(), new ErrorInterceptor())

    await app.listen(APP.PORT);

    if (isDevEnv) {
        logger.info(`Application is running on: http://${getServerIp()}:${APP.PORT}`);
    }
}

bootstrap();
