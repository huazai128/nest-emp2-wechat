import BehaviorStore from "./behaviorStore";
import CommonExtend, { IProps } from "./commonExtend";
import { proxyFetch, proxyXmlHttp } from "./httpProxy";
import { ErrorExtend, ErrorInfo, ExceptionMetrics, HttpMetrics, MechanismType } from "./interfaces";
import { getErrorKey, getErrorUid, parseStackFrames } from "./utils";
import ErrorStackParser from 'error-stack-parser'

/**
 *错误采集上报
 * @export
 * @class ErrorVitals
 * @extends {CommonExtend}
 */
export default class ErrorVitals extends CommonExtend {
    private behaviorTracking: BehaviorStore
    private errorUids: Array<string>
    private behaviorLen: ErrorExtend['behaviorLen']
    constructor({ behaviorTracking, behaviorLen, ...data }: IProps & ErrorExtend) {
        super(data)
        this.behaviorTracking = behaviorTracking
        this.behaviorLen = behaviorLen || -20
        this.errorUids = []
        this.initJsError()
        this.initResourceError()
        this.initPromiseError()
    }

    /**
     * 所有的错误信息上报
     * @param {ExceptionMetrics} error
     * @memberof ErrorVitals
     */
    errorSendHandler = (error: ExceptionMetrics) => {
        const list = this.behaviorTracking?.get()
        const errorInfo = {
            ...error,
            breadcrumbs: list?.slice(this.behaviorLen), // 获取行为操作最后20个,也可以外传
        }
        const hasStatus = this.errorUids.includes(errorInfo.errorUid)
        if (hasStatus) return false
        // 保存上报错误uid， 防止同一个用户重复上报
        this.errorUids.push(errorInfo.errorUid)
        // 清除用户行为
        this.behaviorTracking?.clear()
        // 立即上报错误
        this.sendLog(errorInfo)
    }

    /**
     * 初始化监听JS异常
     * @memberof ErrorVitals
     */
    initJsError = () => {
        const handler = (event: ErrorEvent) => {
            event.preventDefault()
            // 这里只搜集js 错误
            if (getErrorKey(event) !== MechanismType.JS) return false
            const errUid = getErrorUid(`${MechanismType.JS}-${event.message}-${event.filename}`)
            console.log(ErrorStackParser.parse(event.error), parseStackFrames(event.error))
            const errInfo = {
                // 上报错误归类
                reportsType: MechanismType.JS,
                // 错误信息
                value: event.message,
                // 错误类型
                type: event?.error?.name || 'UnKnowun',
                // 解析后的错误堆栈
                stackTrace: {
                    frames: parseStackFrames(event.error)
                },
                // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
                // 错误的标识码
                errorUid: errUid,
                // 其他信息
                meta: {
                    // file 错误所处的文件地址
                    file: event.filename,
                    // col 错误列号
                    col: event.colno,
                    // row 错误行号
                    row: event.lineno,
                },
            } as ExceptionMetrics
            this.errorSendHandler(errInfo)
        }
        window.addEventListener('error', (e) => handler(e), true)
    }

    /**
     * 初始化监听静态资源异常上报
     * @memberof ErrorVitals
     */
    initResourceError = () => {
        const handler = (e: Event) => {
            e.preventDefault()
            // 只采集静态资源错误信息
            if (getErrorKey(e) !== MechanismType.RS) return false
            const target = e.target as any
            const errUid = getErrorUid(`${MechanismType.RS}-${target.src}-${target.tagName}`)
            const errInfo = {
                // 上报错误归类
                reportsType: MechanismType.RS,
                // 错误信息
                value: '',
                // 错误类型
                type: 'ResourceError',
                // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
                // 错误的标识码
                errorUid: errUid,
                // 其他信息
                meta: {
                    url: target.src,
                    html: target.outerHTML,
                    type: target.tagName,
                },
            } as ExceptionMetrics
            this.errorSendHandler(errInfo)
        }
        window.addEventListener('error', (e) => handler(e), true)
    }

    /**
     * 初始化监听promise 错误， 但是HTTP请求时报错，不清楚是那个接口报错了。
     * @memberof ErrorVitals
     */
    initPromiseError = () => {
        const handler = (e: PromiseRejectionEvent) => {
            e.preventDefault()
            const value = e.reason.message || e.reason;
            const type = e.reason.name || 'UnKnowun';
            const errUid = getErrorUid(`${MechanismType.UJ}-${value}-${type}`)
            const errorInfo = {
                // 上报错误归类
                reportsType: MechanismType.UJ,
                // 错误信息
                value,
                // 错误类型
                type,
                // 解析后的错误堆栈
                stackTrace: {
                    frames: parseStackFrames(e.reason),
                },
                // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
                // 错误的标识码
                errorUid: errUid,
                // 附带信息
                meta: {},
            } as ExceptionMetrics;
            // 
            this.errorSendHandler(errorInfo)
        }
        window.addEventListener('unhandledrejection', (e) => handler(e), true)
    }

    /**
     * 用于处理promise 错误中，无法获取是那个接口报错
     * @memberof ErrorVitals
     */
    initHttpError = () => {
        const loadHandler = (metrics: HttpMetrics) => {
            if (metrics.status < 400) return
            const value = metrics.response
            const errUid = getErrorUid(`${MechanismType.HP}-${value}-${metrics.statusText}`)
            const errorInfo = {
                // 上报错误归类
                reportsType: MechanismType.HP,
                // 错误信息
                value,
                // 错误类型
                type: 'HttpError',
                // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
                // 错误的标识码
                errorUid: errUid,
                // 附带信息
                meta: {
                    metrics
                },
            } as ExceptionMetrics;
            this.errorSendHandler(errorInfo)
        }
        proxyXmlHttp(null, loadHandler);
        proxyFetch(null, loadHandler);
    }


    /**
     * 监听跨域报错
     * @memberof ErrorVitals
     */
    initCorsError = (): void => {
        const handler = (event: ErrorEvent) => {
            // 阻止向上抛出控制台报错
            event.preventDefault();
            // 如果不是跨域脚本异常,就结束
            if (getErrorKey(event) !== MechanismType.CS) return;
            const exception = {
                // 上报错误归类
                reportsType: MechanismType.CS,
                // 错误信息
                value: event.message,
                // 错误类型
                type: 'CorsError',
                // 错误的标识码
                errorUid: getErrorUid(`${MechanismType.CS}-${event.message}`),
                // 附带信息
                meta: {},
            } as ExceptionMetrics;
            // 自行上报异常，也可以跨域脚本的异常都不上报;
            this.errorSendHandler(exception);
        };
        window.addEventListener('error', (event) => handler(event), true);
    };

    /**
     * react 组件错误上报
     * @param {*} error
     * @memberof ErrorVitals
     */
    initReactError = (error: Error, errorInfo: ErrorInfo) => {
        const errUid = getErrorUid(`${MechanismType.REACT}-${error.name}-${error.message}`)
        const errInfo = {
            // 上报错误归类
            reportsType: MechanismType.REACT,
            // 错误信息
            value: error.message,
            // 错误类型
            type: error?.name || 'UnKnowun',
            // 解析后的错误堆栈
            stackTrace: {
                frames: parseStackFrames(error)
            },
            // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
            // 错误的标识码
            errorUid: errUid,
            // 其他信息
            meta: {
                // 错误所在的组件
                file: parseStackFrames({ stack: errorInfo.componentStack } as any),
                // 组件名称
                conponentName: errorInfo.componentName
            },
        } as ExceptionMetrics
        this.errorSendHandler(errInfo)
    }
}