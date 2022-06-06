import { FN1 } from "./interfaces";
import UserVitals from "./userVitals";
import WebVitals from "./webVitals";
import ErrorVitals from './errorVitals'

export default class Monitor {
    private webVitals: WebVitals
    private userVitals: UserVitals
    private errorVitals: ErrorVitals
    private customHandler: FN1
    constructor() {
        this.errorVitals = new ErrorVitals()
        this.webVitals = new WebVitals()
        this.userVitals = new UserVitals()
        this.customHandler = this.userVitals.initCustomerHandler()
    }
}