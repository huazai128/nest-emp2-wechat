import { ScopeEnum } from "@app/constants/text.constant";
import { QueryParams } from "@app/decorators/params.decorator";
import { Controller, Get, Res, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { WechatService } from "./wechat.service";

@Controller('wx')
export class WechatController {
    constructor(
        private readonly wechatService: WechatService
    ) {

    }

    @Get('toAuth')
    getAuth(@QueryParams('query') query: any,@Res() res:Response) {
        const url = this.wechatService.getAuthorizeUrl(query.redirectUrl,ScopeEnum.SNSAPI_USERINFO, '12121');
        return res.status(301).redirect(url)
    }

    @Get('jssdk')
    async getJsSdk (@Req() req: Request) {
        const url =  req.get('referer') as string
        return await this.wechatService.getSdk(url);
    }
}