import { ApiWhiteList } from "@app/constants/api.contant";
import { RouterWhiteList } from "@app/constants/router.constant";
import { Lang, ScopeEnum } from "@app/constants/text.constant";
import { CustomError } from "@app/errors/custom.error";
import { User } from "@app/interfaces/request.interface";
import { AuthService } from "@app/modules/auth/auth.service";
import { WechatService } from "@app/modules/wechat/wechat.service";
import { AxiosService } from "@app/processors/axios/axios.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction} from 'express';

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
        const referer = req.get('referer') as string
        const user = req.session.user as User
        const code = req.query.code as string;  
        if(!user?.userId && !(RouterWhiteList.includes(url) || ApiWhiteList.includes(url))) {
            if(code) {
               const data =  await this.wechatService.getSnsAccessToken(code)
               const temp = JSON.parse(data.toString());
                if (temp.errcode) {
                    throw new CustomError({ message: temp.errmsg,  }, 400)
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
                    throw new CustomError({ message: 'scope不一致' }, 400)
                }
            } else {
                let pageUrl: string;
                if(isApi){
                    pageUrl = referer;
                }else{
                    pageUrl = ('https' + '://' + req.get('Host') + req.originalUrl);
                }
                const url = await this.wechatService.getAuthorizeUrl(pageUrl,ScopeEnum.SNSAPI_USERINFO);
                return res.status(301).redirect(url)
            }
        } else {
            req.session.touch();
        }
        return next()
    }
}