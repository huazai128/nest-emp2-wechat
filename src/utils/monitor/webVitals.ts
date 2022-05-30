import { getFCP } from 'web-vitals';
import { IMetrics } from "./interfaces"
import { afterLoad, getFP, getNavigationTiming, getResourceFlow, supported } from './utils'
import SendLog from './send';

export default class Performance extends SendLog {
    // 本地暂存数据在 Map 里 （也可以自己用对象来存储）
    private startTime: number
    private diffTime = 0
    constructor() {
        super()
        this.startTime = Date.now();
        this.initResourceFlow();
        this.initFMP()
        afterLoad(() => {
            this.initFP();
            this.initNavigationTiming();
            this.initFCP();
        });
    }

    // 白屏
    initFP = async () => {
        const entry = await getFP();
        if (entry) {
        }
    };

    // 灰屏
    initFCP = (): void => {
        getFCP((entry) => {
            const time = Date.now() - this.startTime
            this.diffTime = Number((entry?.value - time).toFixed(2))
        })
    };

    // 首次绘制内容
    initFMP = () => {
        let isOnce = false
        const time = this.startTime;
        const iOb = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    if (!isOnce) {
                        const t = Date.now() - time + this.diffTime
                        console.log('FMP', t)
                        isOnce = true
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.85]
        })
        const mOb = new MutationObserver(function (mutationsList: MutationRecord[]) {
            mutationsList.forEach(function (mutation: MutationRecord) {
                const addedNodes = mutation.addedNodes
                addedNodes.forEach((node: any) => {
                    iOb.observe(node)
                })
            });
        })
        mOb.observe(document.body, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true,
        })
    }

    // 初始化 timing
    initNavigationTiming = (): void => {
        const navigationTiming = getNavigationTiming();
        const metrics = navigationTiming as IMetrics;
        // this.metrics.set(MetricsName.NT, metrics);
    };

    // 初始化 RF 
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
                // this.metrics.set(MetricsName.RF, metrics);
            };
            // 当页面 pageshow 触发时，中止
            window.addEventListener('pageshow', stopListening, { once: true, capture: true });
        }
    };
}