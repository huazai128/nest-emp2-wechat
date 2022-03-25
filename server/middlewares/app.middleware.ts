import { isDevEnv } from "@app/app.env";
import { User } from "@app/interfaces/request.interface";
import logger from "@app/utils/logger";
import { Injectable, NestMiddleware, Req } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express'

/**
 * 用于app内嵌页面授权访问
 * @export
 * @class OriginMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class AppMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        const user = request.session.user as User
        if(!isDevEnv && request.isApp && !user.userId){
            logger.info('来源为app')
        }
        return next()
    }
}