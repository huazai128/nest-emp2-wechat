import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CookiesResult {
    jwt: string
}

/**
 * Cookies 自定义装饰器，解析cookie参数
 * @function QueryParams
 * @example `@Cookies()`
 * @example `@Cookies('jwt')`
 */
export const Cookies = createParamDecorator(
  (data: keyof CookiesResult, ctx: ExecutionContext):CookiesResult => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);