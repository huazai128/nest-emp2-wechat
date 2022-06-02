import { FN1 } from "./interfaces";
import UserVitals from "./userVitals";
import WebVitals from "./webVitals";

export default class Monitor {
    private webVitals: WebVitals
    private userVitals: UserVitals
    private customHandler: FN1
    constructor() {
        this.webVitals = new WebVitals()
        this.userVitals = new UserVitals()
        this.customHandler = this.userVitals.initCustomerHandler()
    }
}