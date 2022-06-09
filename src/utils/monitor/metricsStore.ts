import { IMetrics, MetricsName, SendExtend } from "./interfaces";

/**
 * 存储常规上报数据
 * @export
 * @class MetricsStore
 */
export default abstract class MetricsStore {
    public state: Map<MetricsName | string, IMetrics>;
    public keys: Array<MetricsName | string>
    public isOver: boolean
    constructor() {
        this.keys = []
        this.isOver = true
        this.state = new Map<MetricsName | string, IMetrics>();
    }

    set = (key: MetricsName | string, value: IMetrics): void => {
        this.handlerCommon(key)
        this.state.set(key, value);
    }

    add = (key: MetricsName | string, value: IMetrics): void => {
        this.handlerCommon(key)
        const keyValue = this.state.get(key);
        this.state.set(key, keyValue ? keyValue.concat([value]) : [value]);
    }

    get = (key: MetricsName | string): IMetrics | undefined => {
        const value = this.state.get(key)
        this.state.delete(key)
        this.keys = this.keys.filter((item) => item !== key)
        return value;
    }

    has = (key: MetricsName | string): boolean => {
        return this.state.has(key);
    }

    clear = () => {
        this.state.clear();
    }

    getValues = (): IMetrics => {
        // Map 转为 对象 返回
        return Object.fromEntries(this.state);
    }

    /**
     * 处理通用逻辑，抽象类的抽象方法
     * @param {(MetricsName | string)} key
     * @memberof MetricsStore
     */
    abstract handlerCommon(key: MetricsName | string): void
}