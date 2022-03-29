import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionInfo, HttpResponseError } from "@app/interfaces/response.interface";
import { UnAuthStatus } from "@app/constants/error.constant";
import { isDevEnv } from "@app/app.env";
import logger from "@app/utils/logger";
import { Response, Request } from 'express'
import { get, isString } from 'lodash'


/**
 * 错误拦截，可以针对接口、页面、权限等异常拦截进行处理
 * @export
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
        let isApi = request.url.includes('/api/') 
         
        let errorResponse: ExceptionInfo = exception.getResponse?.() as ExceptionInfo
        errorResponse = get(errorResponse, 'response') || errorResponse;
        const errorMessage = get(errorResponse, 'message') || errorResponse
        const errorInfo = get(errorResponse, 'error')  || null
        const resultStatus = get(errorResponse, 'status') || status
        
        if(!isApi) {
            isApi = !!get(errorResponse, 'isApi')
        }
        
        const data: HttpResponseError = {
            status: resultStatus,
            message: errorMessage,
            error: errorInfo?.message || (isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
            debug: isDevEnv ? errorInfo?.stack || exception.stack : 0,
        }

        // default 404
        if (status === HttpStatus.NOT_FOUND) {
            data.error = data.error || `Not found`
            data.message = data.message || `Invalid API: ${request.method} > ${request.url}`
        }
        const isUnAuth = UnAuthStatus.includes(resultStatus)
        
        // logger.error(`错误拦截error:${JSON.stringify(data) }`)

        if (isUnAuth && !isApi) {
            const pageUrl = ('https' + '://' + request.get('Host') + request.originalUrl);
            request.session.destroy(() => {
                logger.info('session已清除')
            });
            response.clearCookie('jwt');
            return response.redirect(`/wx/toAuth?redirectUrl=${ pageUrl }`)
        } else {
            return isApi ? response.status(status).json(data) : response.redirect('error')
        }
    }
}