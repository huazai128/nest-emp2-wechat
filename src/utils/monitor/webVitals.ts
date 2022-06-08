import { getFCP } from 'web-vitals';
import CommonExtend, { IProps } from './commonExtend';
import { IMetrics, MetricsName } from "./interfaces"
import { afterLoad, getFP, getNavigationTiming, getResourceFlow, mOberver, normalizePerformanceRecord, supported } from './utils'

/**
 * 性能
 * @export
 * @class Performance
 * @extends {SendLog}
 */
export default class WebVitals extends CommonExtend {
    private startTime: number
    private diffTime = 0
    constructor(data: IProps) {
        super(data)
        this.startTime = Date.now();
        this.initResourceFlow();
        this.initFMP()
        afterLoad(() => {
            this.initFP();
            this.initNavigationTiming();
            this.initFCP();
        });
    }

    /**
     * 白屏
     * @memberof WebVitals
     */
    initFP = async () => {
        const entry = await getFP();
        if (entry) {
            this.set(MetricsName.FP, normalizePerformanceRecord({ ...entry, reportsType: MetricsName.FP }))
        }
    };

    /**
     * 灰屏
     * @memberof WebVitals
     */
    initFCP = (): void => {
        getFCP(({ entries, ...entry }) => {
            const arr = entries.map((item) => normalizePerformanceRecord(item))
            const time = Date.now() - this.startTime
            this.diffTime = Number((entry?.value - time).toFixed(2))
            this.set(MetricsName.FCP, normalizePerformanceRecord({ ...entry, entries: arr, reportsType: MetricsName.FCP }))
        })
    };

    /**
     * 首次有效绘制
     * @memberof WebVitals
     */
    initFMP = () => {
        let isOnce = false
        const time = this.startTime;
        const iOb = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    if (!isOnce) {
                        const t = Date.now() - time + this.diffTime
                        this.set(MetricsName.FMP, normalizePerformanceRecord({ time: t, reportsType: MetricsName.FMP }))
                        isOnce = true
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.85]
        })
        const mO = mOberver(function (mutation: MutationRecord) {
            const addedNodes = mutation.addedNodes
            addedNodes.forEach((node: any) => {
                iOb.observe(node)
                mO.disconnect()
            })
        })
    }

    /**
     * 初始化 timing
     * @memberof WebVitals
     */
    initNavigationTiming = (): void => {
        const navigationTiming = getNavigationTiming();
        const metrics = navigationTiming as IMetrics;
        this.set(MetricsName.NT, normalizePerformanceRecord({ ...metrics, reportsType: MetricsName.NT }))
    };

    /**
     * 初始化 RF 
     * @memberof WebVitals
     */
    initResourceFlow = (): void => {
        if (supported.PerformanceObserver) {
            let resourceFlow: Array<PerformanceEntry> = [];
            const resObserve = getResourceFlow(resourceFlow);
            const stopListening = () => {
                if (resObserve) {
                    if (resObserve.takeRecords) {
                        resourceFlow = resObserve.takeRecords().concat(resourceFlow);
                    }
                    resObserve.disconnect();
                }
                const metrics = resourceFlow as IMetrics;
                const list = metrics.map((item: IMetrics) => normalizePerformanceRecord(item))
                this.set(MetricsName.RF, { metrics: list, reportsType: MetricsName.RF })
            };
            // 当页面 pageshow 触发时，中止
            window.addEventListener('pageshow', stopListening, { once: true, capture: true });
        }
    };
}