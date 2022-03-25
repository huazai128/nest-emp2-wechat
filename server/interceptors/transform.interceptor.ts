import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express'
import { HttpResponseSuccess, ResponseStatus } from '@app/interfaces/response.interface';
import { getResponsorOptions } from '@app/decorators/responsor.decorator';
import { WechatService } from '@app/modules/wechat/wechat.service';

/**
 * 拦截
 * @export
 * @class TransformInterceptor
 * @implements {NestInterceptor<T, HttpResponse<T>>}
 * @template T
 */
@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, T | HttpResponseSuccess<T>>
{
    private wechatService: WechatService
    constructor() {
        this.wechatService = new WechatService();
    }
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T | HttpResponseSuccess<T>> | any {
        const res = context.switchToHttp().getResponse<Response>()
        const req = context.switchToHttp().getResponse<Request>()
        const target = context.getHandler()
        const { isApi } = getResponsorOptions(target)
       
        if (!isApi) {
            res.contentType('html')
        }
        return next.handle()
            .pipe(
                map(async(data: any) => {
                    if(!isApi) {
                        const url =('https' + '://' + req.get('Host') + req.originalUrl);
                        data.jsConfig = await this.wechatService.getSdk(url);
                    }
                    if (data.redirectUrl) return res.status(301).redirect(data.redirectUrl)
                    const result = isApi ? {
                        status: ResponseStatus.Success,
                        message: '请求成功',
                        result: data,
                    } : ({ data })
                    return result
                })
            );
    }

    
}
