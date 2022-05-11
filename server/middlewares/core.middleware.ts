
import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware, HttpStatus, RequestMethod } from '@nestjs/common'
import { isDevEnv } from '@app/app.env'
import { CROSS_DOMAIN } from '@app/config'

/**
 * CORS
 * @export
 * @class CorsMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req: Request, response: Response, next: NextFunction) {
        const getMethod = (method) => RequestMethod[method]
        const origins = req.headers.origin

        const ua = req.headers['user-agent'] as string;
        req.isWeixin = this.isWeixin(ua)
        req.isApp = this.isApp(ua)
        req.isPc = this.isPc(ua)

        const origin = (Array.isArray(origins) ? origins[0] : origins) || ''

        const allowedOrigins = [CROSS_DOMAIN.allowedOrigins]

        const allowedMethods = [
            RequestMethod.GET,
            RequestMethod.HEAD,
            RequestMethod.PUT,
            RequestMethod.PATCH,
            RequestMethod.POST,
            RequestMethod.DELETE,
        ]

        const allowedHeaders = [
            'Authorization',
            'Origin',
            'No-Cache',
            'X-Requested-With',
            'If-Modified-Since',
            'Pragma',
            'Last-Modified',
            'Cache-Control',
            'Expires',
            'Content-Type',
            'X-E4M-With',
        ]

        // Allow Origin
        if (!origin || allowedOrigins.includes(origin) || isDevEnv) {
            response.setHeader('Access-Control-Allow-Origin', origin || '*')
        }

        // Headers
        response.header('Access-Control-Allow-Credentials', 'true')
        response.header('Access-Control-Allow-Headers', allowedHeaders.join(','))
        response.header('Access-Control-Allow-Methods', allowedMethods.map(getMethod).join(','))
        response.header('Access-Control-Max-Age', '1728000')
        response.header('Content-Type', 'application/json; charset=utf-8')

        if (req.method === getMethod(RequestMethod.OPTIONS)) {
            return response.sendStatus(HttpStatus.NO_CONTENT)
        } else {
            return next()
        }
    }

    /**
     * 是否为微信
     * @private
     * @param {string} ua
     * @return {*}  {boolean}
     * @memberof TransformInterceptor
     */
    private isWeixin(ua: string): boolean {
        return /micromessenger/i.test(ua);
    }

    /**
     * 是否为app
     * @private
     * @param {string} ua
     * @return {*}  {boolean}
     * @memberof TransformInterceptor
     */
    private isApp(ua: string): boolean {
        // 根据UA上的数据进行判断是否为内部APP
        return false
    }

    /** 
     * 是否为PC端
     * @private
     * @param {string} ua
     * @return {*}  {boolean}
     * @memberof TransformInterceptor
     */
    private isPc(ua: string): boolean {
        return !/(Mobile|iPhone|Android|iPod|ios|iPad|Tablet|Windows Phone)/i.test(ua);
    }
}