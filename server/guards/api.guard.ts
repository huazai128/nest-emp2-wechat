import { ExecutionContext, Injectable } from "@nestjs/common";
import { LoggedInGuard } from "./logged-in.guard";
import { HttpUnauthorizedError } from "@app/errors/unauthorized.error";
import { Request } from 'express'
import { ApiWhiteList } from "@app/constants/api.contant";

@Injectable()
export class ApiGuard extends LoggedInGuard {
    private apiUrl: string
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>()
        this.apiUrl = req.body.transformUrl || req.query.transformUrl
        return super.canActivate(context)
    }
    handleRequest(error, authInfo, errInfo) {
        const validToken = Boolean(authInfo)
        const emptyToken = !authInfo && errInfo?.message === 'No auth token'
        if ((!error && (validToken || emptyToken)) || ApiWhiteList.includes(this.apiUrl)) {
            return authInfo || {}
        } else {
            throw error || new HttpUnauthorizedError()
        }
    }
}