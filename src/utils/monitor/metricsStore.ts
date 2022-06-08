import { IMetrics, MetricsName } from "./interfaces";

/**
 * 存储常规上报数据
 * @export
 * @class MetricsStore
 */
export default class MetricsStore {
    private state: Map<MetricsName | string, IMetrics>;
    public keys: Array<MetricsName | string>

    constructor() {
        this.keys = []
        this.state = new Map<MetricsName | string, IMetrics>();
    }

    set = (key: MetricsName | string, value: IMetrics): void => {
        if (!this.state.has(key)) {
            this.keys.push(key)
        }
        this.state.set(key, value);
    }

    add = (key: MetricsName | string, value: IMetrics): void => {
        if (!this.state.has(key)) {
            this.keys.push(key)
        }
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
}