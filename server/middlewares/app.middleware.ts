import { Injectable, NestMiddleware } from "@nestjs/common";
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
        return next()
    }
}