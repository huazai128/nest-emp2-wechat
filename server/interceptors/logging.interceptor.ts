import { Request } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common'
import { isDevEnv } from '@app/app.env'
import logger from '@app/utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const call$ = next.handle()
        if (!isDevEnv) {
            return call$
        }
        const request = context.switchToHttp().getRequest<Request>()
        const content = request.method + ' -> ' + request.url
        logger.debug('+++ req：', content)
        const now = Date.now()
        return call$.pipe(tap(() => logger.debug('--- res：', content, `${Date.now() - now}ms`)))
    }
}
