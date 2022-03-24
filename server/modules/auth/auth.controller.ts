import {  Controller, Get, Param  } from "@nestjs/common";
import { AuthService } from "./auth.service";
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