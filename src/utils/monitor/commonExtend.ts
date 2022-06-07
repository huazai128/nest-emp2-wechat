import BehaviorStore from "./behaviorStore"
import { SendExtend } from "./interfaces"

export default class CommonExtend {
    public behaviorTracking?: BehaviorStore = undefined
    public sendLog: SendExtend['sendLog']
    constructor({ behaviorTracking, sendLog }: SendExtend) {
        this.sendLog = sendLog
        behaviorTracking && (this.behaviorTracking = behaviorTracking)
    }
}