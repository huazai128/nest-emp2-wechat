import SendLog from "./send";

export default class UserVitals extends SendLog {
    // 最大行为追踪记录数
    public maxBehaviorRecords: number;

    constructor() {
        super();
        this.maxBehaviorRecords = 100
    }
}