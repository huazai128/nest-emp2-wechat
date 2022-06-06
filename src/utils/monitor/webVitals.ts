import { getFCP } from 'web-vitals';
import { IMetrics, SendExtend } from "./interfaces"
import { afterLoad, getFP, getNavigationTiming, getResourceFlow, mOberver, supported } from './utils'
import SendLog from './send';

/**
 * 性能
 * @export
 * @class Performance
 * @extends {SendLog}
 */
export default class WebVitals {
    private startTime: number
    private diffTime = 0
    private sendLog: SendExtend['sendLog']
    constructor({ sendLog }: SendExtend) {
        this.sendLog = sendLog
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
        const mO = mOberver(function (mutation: MutationRecord) {
            const addedNodes = mutation.addedNodes
            addedNodes.forEach((node: any) => {
                iOb.observe(node)
            })
            mO.disconnect()
        })
    }

    // 初始化 timing
    initNavigationTiming = (): void => {
        const navigationTiming = getNavigationTiming();
        const metrics = navigationTiming as IMetrics;
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
            };
            // 当页面 pageshow 触发时，中止
            window.addEventListener('pageshow', stopListening, { once: true, capture: true });
        }
    };
}