import { Request } from 'express'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getServerIp } from '@app/utils/util';

export interface QueryVisitor {
    ip: string | null
    ua?: string
    origin?: string
    referer?: string
}

export interface UserInfo {
    userId: string,
    name: string;
}

export interface QueryCookies {
    [key: string]: any
}

export interface QueryParamsResult {
    body: Record<string, string>
    params: Record<string, string>
    query: Record<string, string>
    cookies: QueryCookies
    visitor: QueryVisitor
    request: Request
    isAuthenticated: boolean,
}
/**
 * QueryParams 自定义装饰器，请求方法解析参数
 * @function QueryParams
 * @example `@QueryParams()`
 * @example `@QueryParams('query')`
 */
export const QueryParams = createParamDecorator((field: keyof QueryParamsResult, ctx: ExecutionContext): QueryParamsResult => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // 获取IP
    const ip = getServerIp()
    // 只有鉴权配置了，才能访问这个属性 不然会报错的
    const isAuthenticated = request.isAuthenticated && request.isAuthenticated()

    const visitor: QueryVisitor = {
        ip,
        ua: request.headers['user-agent'],
        origin: request.headers.origin,
        referer: request.headers.referer,
    }
    const { transformUrl: pUlr, ...otherParams } = request.params || {}
    const { transformUrl: qUlr, ...otherQuery } = request.query || {}

    const user: UserInfo = (request.session as any).user || {}

    const result = {
        params: (!!pUlr && { transformUrl: pUlr, transferData: { ...otherParams, userId: user.userId } }) || {},
        query: (!!qUlr && { transformUrl: qUlr, transferData: { ...otherQuery, userId: user.userId } }) || {},
        cookies: request.cookies,
        isAuthenticated: isAuthenticated,
        visitor,
        request,
    }

    return field ? result[field] : result
})