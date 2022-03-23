import axios, { AxiosRequestConfig as _AxiosRequestConfig, Method } from 'axios'
import config from '@src/config'

export interface AxiosRequestConfig extends _AxiosRequestConfig {
    startTime?: Date
}

export interface HttpParams {
    transformUrl: string // 转发接口
    data: object | FormData // 转发参数
    apiUrl?: string // node 层接口
    otherConfig?: AxiosRequestConfig
    apiTransferType?: string // 对应其他域名，默认不添为baseApi
}

export type GetParmas = Omit<HttpParams, 'data' | 'otherConfig' | 'apiUrl'> & {
    transferData: any
}

enum HTTPERROR {
    LOGICERROR,
    TIMEOUTERROR,
    NETWORKERROR
}

// 判断请求是否成功
const isSuccess = (res: any) => (Object.is(res.status, 'success'))
// 格式化返回结果
const resFormat = (res: any) => res.result || {}

function httpCommon<T>(method: Method, { data, otherConfig, apiUrl, ...otherData }: HttpParams): Promise<T | any> {
    let axiosConfig: AxiosRequestConfig = {
        method,
        url: apiUrl || '/api/transform',
        baseURL: config.apiHost,
    }

    const instance = axios.create()

    const newData: GetParmas = { ...otherData, transferData: { ...data } } as GetParmas

    // 请求拦截
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
            const rdata = response.data
            if (!isSuccess(rdata)) {
                return Promise.reject({
                    msg: rdata.message,
                    errCode: rdata.code || 0,
                    type: HTTPERROR[HTTPERROR.LOGICERROR],
                    config: response.config
                })
            }
            return resFormat(rdata)
        },
        error => {
            return Promise.reject({
                msg: error.response.data.error || error.response.statusText || error.message || 'network error',
                type: /^timeout of/.test(error.message) ? HTTPERROR[HTTPERROR.TIMEOUTERROR] : HTTPERROR[HTTPERROR.NETWORKERROR],
                config: error.config
            })
        }
    )
    if (method === 'get') {
        axiosConfig.params = { transformUrl: newData.transformUrl, ...newData.transferData }
    } else {
        axiosConfig.data = newData
    }
    axiosConfig.startTime = new Date()
    if (otherConfig) {
        axiosConfig = Object.assign(axiosConfig, otherConfig)
    }
    return instance
        .request(axiosConfig)
        .then(res => res)
        .catch(err => {
            console.log(err, '21212')
            return Promise.reject(err.msg || err.stack)
        })
}

function get<T>(data: HttpParams) {
    return httpCommon<T>('get', data)
}
function post<T>(data: HttpParams) {
    return httpCommon<T>('post', data)
}

export default {
    get,
    post,
}