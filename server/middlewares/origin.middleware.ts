import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express'
import { isProdEnv } from "@app/app.env";
import { CROSS_DOMAIN } from "@app/config";

/**
 * 用于验证是否为非法来源
 * @export
 * @class OriginMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class OriginMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction) {
        if (isProdEnv) {
            const { origin, referer } = request.headers
            const isAllowed = (field) => !field || field.includes(CROSS_DOMAIN.allowedReferer)
            const isAllowedOrigin = isAllowed(origin)
            const isAllowedReferer = isAllowed(referer)
            if (!isAllowedOrigin && !isAllowedReferer) {
                return response.status(401).jsonp({
                    status: 401,
                    message: '非法来源',
                    error: null,
                })
            }
        }

        return next()
    }
}