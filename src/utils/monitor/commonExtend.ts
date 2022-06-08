import BehaviorStore from "./behaviorStore"
import { SendExtend } from "./interfaces"
import MetricsStore from './metricsStore'

export type IProps = Omit<MetricsStore, 'state'> & SendExtend
export default class CommonExtend {
    public behaviorTracking?: BehaviorStore = undefined
    public sendLog: SendExtend['sendLog']
    public set: MetricsStore['set']
    public deleteT: MetricsStore['deleteT']
    public add: MetricsStore['add']
    public get: MetricsStore['get']
    public clear: MetricsStore['clear']
    constructor({ behaviorTracking, sendLog, set, deleteT, add, get, clear }: IProps) {
        this.sendLog = sendLog
        this.set = set
        this.add = add
        this.deleteT = deleteT
        this.get = get
        this.clear = clear
        behaviorTracking && (this.behaviorTracking = behaviorTracking)
    }
}