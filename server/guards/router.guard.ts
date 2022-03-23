import { ExecutionContext, Injectable } from "@nestjs/common";
import { LoggedInGuard } from "./logged-in.guard";
import { HttpUnauthorizedError } from "@app/errors/unauthorized.error";
import { Request } from 'express'
import { RouterWhiteList } from "@app/constants/router.constant";
@Injectable()
export class RouterGuard extends LoggedInGuard {
    private routeUrl: string
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>()
        this.routeUrl = req.url
        return super.canActivate(context)
    }
    handleRequest(error, authInfo, errInfo) {
        if ((authInfo && !error && !errInfo) || RouterWhiteList.includes(this.routeUrl)) {
            return authInfo
        } else {
            throw error || new HttpUnauthorizedError(errInfo?.message)
        }
    }

}