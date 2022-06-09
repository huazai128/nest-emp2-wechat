import BehaviorStore from "./behaviorStore"
import { SendExtend } from "./interfaces"
import MetricsStore from './metricsStore'

export type IProps = Omit<MetricsStore, 'state'> & SendExtend & {
    isExposure?: boolean
}
export default class CommonExtend {
    public sendLog: SendExtend['sendLog']
    public set: MetricsStore['set']
    public add: MetricsStore['add']
    public get: MetricsStore['get']
    public clear: MetricsStore['clear']
    constructor({ sendLog, set, add, get, clear }: IProps) {
        this.sendLog = sendLog
        this.set = set
        this.add = add
        this.get = get
        this.clear = clear
    }
}