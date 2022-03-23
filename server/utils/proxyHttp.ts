import { createProxyMiddleware } from 'http-proxy-middleware'
import { NextFunction, Request, Response } from 'express'
import { config } from '@app/config'

let cookie: any = null

const middleware = createProxyMiddleware({
    target: config.apiPrefix.baseApi, // 目前只考虑一个
    changeOrigin: true,
    onProxyReq(proxyReq) {
        // 将本地请求的头信息复制一遍给代理。
        // 包含cookie信息，这样就能用登录后的cookie请求相关资源
        if (cookie) {
            proxyReq.setHeader('cookie', cookie)
        }
    },
    onProxyRes(proxyRes) {
        // 将服务器返回的头信息，复制一遍给本地请求的响应。
        // 这样就能实现 执行完登录后，本地的返回请求中也有相关cookie，从而实现登录功能代理。
        const proxyCookie = proxyRes.headers['set-cookie']
        if (proxyCookie) {
            cookie = proxyCookie
        }
    },
})

// 针对于特定情况下接口需要转发,
export const proxyHttp = (request: Request, response: Response, next: NextFunction) => {
    return middleware(request, response, next)
}
