import BehaviorStore from "./behaviorStore";
import { ExceptionMetrics, MechanismType, SendExtend } from "./interfaces";
import SendLog from "./send";
import UserVitals from "./userVitals";
import { getErrorKey, getErrorUid, parseStackFrames } from "./utils";

export default class ErrorVitals {
    private errorUids: Array<string>;
    private behaviorTracking?: BehaviorStore = undefined
    private sendLog: SendExtend['sendLog']
    constructor({ behaviorTracking, sendLog }: SendExtend) {
        this.sendLog = sendLog
        behaviorTracking && (this.behaviorTracking = behaviorTracking)
        this.errorUids = []
        this.initJsError()
    }

    /**
     * 所有的错误信息上报
     * @param {ExceptionMetrics} error
     * @memberof ErrorVitals
     */
    errorSendHandler = (error: ExceptionMetrics) => {
        const errorInfo = {
            ...error,
            breadcrumbs: this.behaviorTracking?.get(),
        }
        const hasStatus = this.errorUids.includes(errorInfo.errorUid)
        if (hasStatus) return false
        this.errorUids.push(errorInfo.errorUid)
        this.sendLog(errorInfo)
    }

    initJsError = () => {
        const handler = (event: ErrorEvent) => {
            // console.log(event, '========', this.behaviorTracking.get())
            event.preventDefault()
            // 这里只搜集js 错误
            if (getErrorKey(event) !== MechanismType.JS) return false
            const errUid = getErrorUid(`${MechanismType.JS}-${event.message}-${event.filename}`)
            const errInfo = {
                // 上报错误归类
                errorType: MechanismType.JS,
                // 错误信息
                value: event.message,
                // 错误类型
                type: event?.error?.name || 'UnKnowun',
                // 解析后的错误堆栈
                stackTrace: {
                    frames: parseStackFrames(event.error)
                },
                // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
                // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
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
            console.log(errInfo, 'errInfo')
        }
        window.addEventListener('error', (e) => handler(e), true)
    }

}