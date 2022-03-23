import { HttpRequest } from "@app/interfaces/request.interface";
import { TransformPipe } from "@app/pipes/transform.pipe";
import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express'
import { ResponseStatus } from "@app/interfaces/response.interface";
import { Responsor } from "@app/decorators/responsor.decorator";

@Controller('api')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    /**
     * 登录接口
     * @param {Request} req
     * @param {HttpRequest} data
     * @param {Response} res
     * @return {*} 
     * @memberof AuthController
     */
    @Responsor.api()
    @Post('login')
    public async adminLogin(@Req() req: Request, @Body(new TransformPipe()) data: HttpRequest, @Res() res: Response) {
        const { access_token, token, ...result } = await this.authService.login(data)
        res.cookie('jwt', access_token);
        res.cookie('userId',result.userId);
        req.session.user = result;
        return res.status(200).send({
            result: result,
            status: ResponseStatus.Success,
            message: '登录成功',
        })
    }

    /**
     *
     * @param {string} id
     * @return {*} 
     * @memberof AuthController
     */
    @Get('user')
    @Responsor.api()
    public async getUserInfo(@Param('id') id: string) {
        return await this.authService.findById({ id })
    }
}