import BehaviorStore from "./behaviorStore";
import { proxyFetch, proxyXmlHttp } from "./httpProxy";
import { CustomAnalyticsData, FN1, HttpMetrics, MetricsName, PageInfo, SendExtend } from "./interfaces";
import SendLog from "./send";
import { mOberver } from "./utils";

/**
 * 用户行为
 * @export
 * @class UserVitals
 * @extends {SendLog}
 */
export default class UserVitals {
    // 最大行为追踪记录数
    public maxBehaviorRecords: number;
    public behaviorTracking: BehaviorStore
    private events: Array<string> = ['click', 'touchstart']
    private sendLog: SendExtend['sendLog']
    constructor({ sendLog }: SendExtend) {
        this.maxBehaviorRecords = 100
        this.sendLog = sendLog
        this.behaviorTracking = new BehaviorStore({ maxBehaviorRecords: this.maxBehaviorRecords });
        this.initClickHandler();
        this.initExposure();
        this.initHttpHandler();
    }

    /**
     * 上报pv
     * @memberof UserVitals
     */
    initPV = (pageInfo: PageInfo) => {
        // this.sendLog() // 上报
        this.behaviorTracking.push({
            name: MetricsName.RCR,
            value: pageInfo
        })
    }

    /**
     * 上报事件
     * @memberof UserVitals
     */
    initClickHandler = () => {
        const handle = (e: MouseEvent | any) => {
            const target = e.target
            const obj = {
                id: target.id,
                classList: Array.from(target.classList),
                tagName: target.tagName,
                text: target.textContent,
            }
            this.behaviorTracking.push({
                name: MetricsName.CBR,
                value: obj
            })
            // 上报点击事件
        }
        this.events.forEach((event) => {
            window.addEventListener(event, handle, true)
        })
    }

    /**
     * 上报曝光
     * @memberof UserVitals
     */
    initExposure = () => {
        // 针对曝光研究
        const itOberser = new IntersectionObserver(function (entries, observer: IntersectionObserverInit) {
            entries.forEach((entry) => {
                // 检查元素发生了碰撞
                const nodeRef = entry.target as HTMLElement
                const att = nodeRef.getAttribute('data-visible')
                if (entry.isIntersecting && entry.intersectionRatio >= 0.55 && !att) {
                    let data: any = nodeRef.dataset || {} // 曝光买点日志
                    data = {
                        ...data,
                        classList: Array.from(nodeRef.classList),
                        tagName: nodeRef.tagName,
                        text: nodeRef.textContent,
                    }
                    const obj = {
                        name: MetricsName.CE,
                        value: data,
                    }
                    // 曝光不是用户行为，可以不作为采集信息
                    nodeRef.setAttribute('data-visible', 'y')
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.55]
        })

        const nodes = (document as Document).querySelectorAll('.on-visible')
        nodes.forEach((child) => {
            itOberser?.observe(child)
        });

        mOberver(function (mutation: MutationRecord) {
            const addedNodes = mutation.addedNodes
            const list = itOberser.takeRecords();
            addedNodes.forEach((node: any) => {
                const isS = node.classList.contains('on-visible')
                isS && itOberser.observe(node)
                const nodes = node.querySelectorAll('.on-visible')
                nodes?.forEach((child: HTMLElement) => {
                    itOberser.observe(child)
                });
            })
        })
    }

    /**
     * 用户自定义埋点
     * @memberof UserVitals
     */
    initCustomerHandler = (): FN1 => {
        return (options: CustomAnalyticsData) => {
            // 记录到用户行为追踪队列
            this.behaviorTracking.push({
                name: MetricsName.CDR,
                value: options,
            });
        }
    }

    /**
     * http请求上报
     * @memberof UserVitals
     */
    initHttpHandler = (): void => {
        const handler = (metrics: HttpMetrics) => {
            this.behaviorTracking.push({
                name: MetricsName.HT,
                value: metrics
            })
        }
        proxyXmlHttp(null, handler)
        proxyFetch(null, handler)
    }
}