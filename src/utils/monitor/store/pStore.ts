import { MetricsName, IMetrics } from "../interfaces"

export default class PMetricsStore {
    state: Map<MetricsName | string, IMetrics>

    constructor() {
        this.state = new Map<MetricsName | string, IMetrics>()
    }

    set(key: MetricsName | string, value: IMetrics): void {
        this.state.set(key, value)
    }

    get(key: MetricsName | string): IMetrics | undefined {
        return this.state.get(key)
    }

    add(key: MetricsName | string, value: IMetrics): void {
        const oldValue = this.state.get(key)
        this.state.set(key, oldValue ? oldValue.concat([value]) : [value])
    }

    has(key: MetricsName | string): boolean {
        return this.state.has(key)
    }

    clear() {
        this.state.clear()
    }

    getValues(): IMetrics {
        return Object.fromEntries(this.state)
    }
}