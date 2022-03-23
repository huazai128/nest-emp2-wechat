import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { RouterGuard } from '@app/guards/router.guard';
import { Request } from 'express'
import { SessionPipe } from '@app/pipes/session.pipe';
import { QueryParams } from '@app/decorators/params.decorator';

@Controller()
export class RouterController {

    /**
   * 渲染页面
   * @param {Request} req
   * @return {*} 
   * @memberof AppController
   */
    @Get('login')
    @Render('index')
    login(@QueryParams('request', new SessionPipe()) req: Request) {
        if (req.isLogin) {
            // 重定向
            return { redirectUrl: '/' }
        } else {
            return { data: 121212 }
        }
    }

    /**
     * 错误页面
     * @return {*} 
     * @memberof AppController
     */
    @Get('error')
    @Render('error')
    getError() {
        return { msg: '1212' }
    }

    /**
     * 渲染页面
     * @param {Request} req
     * @return {*} 
     * @memberof AppController
     */
    @UseGuards(RouterGuard)
    @Get()
    @Render('index')
    getTest(@Req() req: Request) {
        return { data: 12 }
    }

}
