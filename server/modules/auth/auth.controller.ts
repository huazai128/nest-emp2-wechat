import { HttpRequest } from "@app/interfaces/request.interface";
import { TransformPipe } from "@app/pipes/transform.pipe";
import { Body, Controller, Get, Param, Post, Req, Res  } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from 'express'
import { ResponseStatus } from "@app/interfaces/response.interface";
import { Responsor } from "@app/decorators/responsor.decorator";

@Controller('api')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
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