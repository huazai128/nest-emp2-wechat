import { Lang, ScopeEnum } from "@app/constants/text.constant";
import { QueryParams } from "@app/decorators/params.decorator";
import { Controller, Get, Res, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "../auth/auth.service";
import { WechatService } from "./wechat.service";

interface AuthCode {
    code: string
    state: ScopeEnum
}

@Controller('wx')
export class WechatController {
    constructor(
        private readonly wechatService: WechatService,
        private readonly authService: AuthService,
    ) {

    }

    /**
     * 微信授权
     * @param {*} query
     * @param {Response} res
     * @return {*} 
     * @memberof WechatController
     */
    @Get('toAuth')
    geToAuth(@QueryParams('query') query: any,@Res() res:Response) {
        const url = this.wechatService.getAuthorizeUrl(query.redirectUrl,ScopeEnum.SNSAPI_USERINFO, '12121');
        return res.status(301).redirect(url)
    }
    
    /**
     * PC端微信扫码授权登录
     * @param {*} query
     * @param {Response} res
     * @return {*} 
     * @memberof WechatController
     */
    @Get('auth')
    async getAuth(@Req() req: Request,@QueryParams('query') { code }: AuthCode,@Res() res:Response) {
        if(code) {
            const data =  await this.wechatService.getSnsAccessToken(code)
            const temp = JSON.parse(data.toString());
            if (temp.errcode) {
                throw temp.errmsg
            }
            if (temp.scope == ScopeEnum.SNSAPI_USERINFO) {
                // 获取用户信息
                const result = await this.wechatService.getUserInfo(temp.access_token, temp.openid, Lang.ZH_CN);
                // 把数据保存到后端， 后端返回userId
                const newDate: any = this.authService.login({ transformUrl: '', transferData: result})
                res.cookie('jwt', newDate.access_token);
                res.cookie('userId',newDate.userId);
                req.session.user = newDate;
                return res.status(200).jsonp(newDate)
            } else {
                throw 'scope不一致'
            }
        } else {
            throw '缺少参数code'
        }
    }

    /**
     * 获取微信sdk 配置信息
     * @param {Request} req
     * @return {*} 
     * @memberof WechatController
     */
    @Get('jssdk')
    async getJsSdk (@Req() req: Request) {
        const url =  req.get('referer') as string
        return await this.wechatService.getSdk(url);
    }
}