import logger from "@app/utils/logger";
import { UnAuthStatus } from "@app/constants/error.constant";
import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource, Method } from "axios";

/**
 * https://github.com/nestjs/axios
 * 没有使用@nest/axios 是因为rxjs版本不一样导致调用接口没有出发请求（再次去看居然更新了rxjs, 先用自己这套吧）
 * @export
 * @class AxiosService
 */
@Injectable()
export class AxiosService {

    public get<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
        return this.makeObservable<T>('get', url, data, config);
    }

    public post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
        return this.makeObservable<T>('post', url, data, config);
    }

    protected makeObservable<T>(
        method: Method,
        url: string,
        data: any,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {

        let axiosConfig: AxiosRequestConfig = {
            method: method,
            url,
        }

        const instance = axios.create()

        let cancelSource: CancelTokenSource;
        if (!axiosConfig.cancelToken) {
            cancelSource = axios.CancelToken.source();
            axiosConfig.cancelToken = cancelSource.token;
        }
        // 请求拦截  这里只创建一个，后续在优化拦截
        instance.interceptors.request.use(
            cfg => {
                cfg.params = { ...cfg.params, ts: Date.now() / 1000 }
                return cfg
            },
            error => Promise.reject(error)
        )

        // 响应拦截
        instance.interceptors.response.use(
            response => {
                const rdata = response.data || {}
                if (rdata.code == 200 || rdata.code == 0) {
                    logger.info(`转发请求接口成功=${url}, 获取数据${JSON.stringify(rdata.result).slice(0, 350)}`)
                    return rdata.result
                } else {
                    return Promise.reject({
                        msg: rdata.message || '转发接口错误',
                        errCode: rdata.code || HttpStatus.BAD_REQUEST,
                        config: response.config
                    })
                }
            },
            error => {
                const data = error.response && error.response.data || {}
                const msg = error.response && (data.error || error.response.statusText)
                return Promise.reject({
                    msg: msg || error.message || 'network error',
                    errCode: data.code || HttpStatus.BAD_REQUEST,
                    config: error.config
                })
            }
        )
        if (method === 'get') {
            axiosConfig.params = data
        } else {
            axiosConfig.data = data
        }
        if (config) {
            axiosConfig = Object.assign(axiosConfig, config)
        }
        return instance
            .request(axiosConfig)
            .then((res: any) => res || {})
            .catch((err) => {
                logger.error(`转发请求接口=${url},参数为=${JSON.stringify(data)},错误原因=${err.msg || '请求报错了'}; 请求接口状态code=${err.errCode}`)
                if (UnAuthStatus.includes(err.errCode)) {
                    throw new UnauthorizedException({
                        status: err.errCode,
                        message: err.msg || err.stack
                    }, err.errCode)
                } else {
                    throw new BadRequestException({
                        isApi: true,
                        status: err.errCode,
                        message: err.msg || err.stack
                    }, err.errCode)
                }
            })

    };
}