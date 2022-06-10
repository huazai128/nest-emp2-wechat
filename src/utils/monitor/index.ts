import 'intersection-observer'
import 'mutationobserver-polyfill'
import '@fastly/performance-observer-polyfill/polyfill'
import 'sendbeacon-polyfill'
import { ErrorInfo, FN1, FN2 } from "./interfaces";
import UserVitals from "./userVitals";
import WebVitals from "./webVitals";
import ErrorVitals from './errorVitals'
import SendLog from "./send";

interface MonitorProps {
    url: string // 上报Url
    isExposure?: boolean // 是否支持曝光埋点
}
export default class Monitor {
    private webVitals: WebVitals
    private userVitals: UserVitals
    private errorVitals: ErrorVitals
    private send: SendLog
    public customHandler: FN1
    public initReactError: FN2<Error, ErrorInfo>
    constructor({ url, isExposure }: MonitorProps) {
        this.send = new SendLog(url)
        this.webVitals = new WebVitals({ ...this.send })
        this.userVitals = new UserVitals({ ...this.send, isExposure: !!isExposure })
        this.errorVitals = new ErrorVitals({
            behaviorTracking: this.userVitals.behaviorTracking,
            behaviorLen: -30,
            ...this.send
        })
        this.customHandler = this.userVitals.initCustomerHandler()
        this.initReactError = this.errorVitals.initReactError
        this.send.initRouterChange(() => {
            this.userVitals.initPV()
        })
    }
}