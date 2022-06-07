import { ErrorInfo, FN1, FN2 } from "./interfaces";
import UserVitals from "./userVitals";
import WebVitals from "./webVitals";
import ErrorVitals from './errorVitals'
import SendLog from "./send";

export default class Monitor {
    private webVitals: WebVitals
    private userVitals: UserVitals
    private errorVitals: ErrorVitals
    private send: SendLog
    private customHandler: FN1
    private initReactError: FN2<Error, ErrorInfo>
    constructor(url: string) {
        this.send = new SendLog(url)
        this.webVitals = new WebVitals({ sendLog: this.send.sendLog })
        this.userVitals = new UserVitals({ sendLog: this.send.sendLog })
        this.errorVitals = new ErrorVitals({
            behaviorTracking: this.userVitals.behaviorTracking,
            sendLog: this.send.sendLog
        })
        this.customHandler = this.userVitals.initCustomerHandler()
        this.initReactError = this.errorVitals.initReactError
        this.send.initRouterChange(() => {
            this.userVitals.initPV(this.send.pageInfo)
        })
    }
}