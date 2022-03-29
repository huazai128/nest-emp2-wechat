import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express'
import { isDevEnv } from "@app/app.env";
import logger from "@app/utils/logger";
import { AuthService } from "@app/modules/auth/auth.service";

/**
 * 用于本地模仿用户登录授权
 * @export
 * @class OriginMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class DevMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService
    ) {}

    use(request: Request, response: Response, next: NextFunction) {
        if(isDevEnv) {
            const userInfo = {
                username: 'admin',
                userId: '6177ad66d32b52cbf5bd8ac8',
            }
            const token = this.authService.creatToken(userInfo)
            response.cookie('jwt', token.access_token);
            response.cookie('userId',userInfo.userId);
            // 强制注入cookie
            request.cookies['jwt'] = token.access_token
            request.session.user = userInfo;
        }
        return next()
    }
}