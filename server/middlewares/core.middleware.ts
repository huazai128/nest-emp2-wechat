
import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware, HttpStatus, RequestMethod } from '@nestjs/common'
import { isDevEnv } from '@app/app.env'
import { CROSS_DOMAIN } from '@app/config'

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req: Request, response: Response, next: NextFunction) {
        const getMethod = (method) => RequestMethod[method]
        const origins = req.headers.origin

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
}