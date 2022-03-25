import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express'
import { isDevEnv } from "@app/app.env";
import logger from "@app/utils/logger";

/**
 * 用于本地模仿用户登录授权
 * @export
 * @class OriginMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class AppMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        if(isDevEnv) {
            logger.info('来源为本地开发')
        }
        return next()
    }
}