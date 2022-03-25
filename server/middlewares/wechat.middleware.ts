import { isDevEnv } from "@app/app.env";
import { RouterWhiteList } from "@app/constants/router.constant";
import { Lang, ScopeEnum } from "@app/constants/text.constant";
import { CustomError } from "@app/errors/custom.error";
import { User } from "@app/interfaces/request.interface";
import { AuthService } from "@app/modules/auth/auth.service";
import { WechatService } from "@app/modules/wechat/wechat.service";
import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction} from 'express';

/**
 *  用于微信浏览器下授权
 * @export
 * @class WechatMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class WechatMiddleware implements NestMiddleware {
    constructor(
        private readonly wechatService: WechatService,
        private readonly authService: AuthService
    ) {

    }
    async use(req: Request, res: Response, next: NextFunction) {
        const url = req.originalUrl as string
        const isApi = url.includes('/api/') 
        const user = req.session.user as User
        const code = req.query.code as string;  
        if(!isApi && !user?.userId && !RouterWhiteList.includes(url) && !isDevEnv && req.isWeixin) {
            if(code) {
               const data =  await this.wechatService.getSnsAccessToken(code)
               const temp = JSON.parse(data.toString());
                if (temp.errcode) {
                    throw new CustomError({ message: temp.errmsg}, HttpStatus.BAD_GATEWAY)
                }
                if (temp.scope == ScopeEnum.SNSAPI_USERINFO) {
                    // 获取用户信息
                    const result = await this.wechatService.getUserInfo(temp.access_token, temp.openid, Lang.ZH_CN);
                    // 把数据保存到后端， 后端返回userId
                    const newDate: any = this.authService.login({ transformUrl: '', transferData: result})
                    res.cookie('jwt', newDate.access_token);
                    res.cookie('userId',newDate.userId);
                    req.session.user = newDate;
                } else {
                    throw new CustomError({ message: 'scope不一致' }, HttpStatus.BAD_GATEWAY)
                }
            } else {
                const pageUrl = ('https' + '://' + req.get('Host') + req.originalUrl);
                const url = await this.wechatService.getAuthorizeUrl(pageUrl,ScopeEnum.SNSAPI_USERINFO);
                return res.status(301).redirect(url)
            }
        } else {
            // 更新token 日期
            req.session.touch();
        }
        return next()
    }
}