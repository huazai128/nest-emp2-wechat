import { AUTH } from "@app/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { AuthService } from "./auth.service";
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: (req: Request) => {
                return req.cookies['jwt']
            },
            secretOrKey: AUTH.jwtTokenSecret
        })
    }

    async validate(payload: any) {
        const res = await this.authService.validateUser(payload);
        return res
    }
}