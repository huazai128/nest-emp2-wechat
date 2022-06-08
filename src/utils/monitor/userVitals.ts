import BehaviorStore from "./behaviorStore";
import CommonExtend, { IProps } from "./commonExtend";
import { proxyFetch, proxyXmlHttp } from "./httpProxy";
import { BehaviorStack, CustomAnalyticsData, FN1, HttpMetrics, MetricsName, PageInfo } from "./interfaces";
import { mOberver } from "./utils";

/**
 * 用户行为
 * @export
 * @class UserVitals
 * @extends {SendLog}
 */
export default class UserVitals extends CommonExtend {
    // 最大行为追踪记录数
    public maxBehaviorRecords: number;
    public behaviorTracking: BehaviorStore
    private events: Array<string> = ['click', 'touchstart']
    constructor({ isExposure, ...data }: IProps) {
        super(data)
        this.maxBehaviorRecords = 100
        this.behaviorTracking = new BehaviorStore({ maxBehaviorRecords: this.maxBehaviorRecords });
        this.initClickHandler();
        this.initHttpHandler();
        isExposure && this.initExposure();
    }

    /**
     * 上报pv
     * @memberof UserVitals
     */
    initPV = () => {
        const metrice = {
            reportsType: MetricsName.RCR,
        }
        this.add(MetricsName.RCR, metrice)
        this.behaviorTracking.push(metrice)
    }

    /**
     * 上报事件
     * @memberof UserVitals
     */
    initClickHandler = () => {
        const handle = (e: MouseEvent | any) => {
            const target = e.target
            const data = target.dataset || {} // 点击事件上报参数
            const metrice: BehaviorStack = {
                reportsType: MetricsName.CBR,
                id: target.id,
                classList: Array.from(target.classList),
                tagName: target.tagName,
                text: target.textContent,
                ...data,
            }
            this.add(MetricsName.CBR, metrice)
            this.behaviorTracking.push({
                ...metrice
            })
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
        const itOberser = new IntersectionObserver((entries, observer: IntersectionObserverInit) => {
            entries.forEach((entry) => {
                // 检查元素发生了碰撞
                const nodeRef = entry.target as HTMLElement
                const att = nodeRef.getAttribute('data-visible')
                if (entry.isIntersecting && entry.intersectionRatio >= 0.55 && !att) {
                    const data: any = nodeRef.dataset || {} // 曝光埋点日志数据
                    const metrice: BehaviorStack = {
                        reportsType: MetricsName.CE,
                        classList: Array.from(nodeRef.classList),
                        tagName: nodeRef.tagName,
                        text: nodeRef.textContent,
                        ...data,
                    }
                    this.add(MetricsName.CE, metrice)
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
            const metrice: BehaviorStack = {
                reportsType: MetricsName.CDR,
                ...options,
            }
            this.add(MetricsName.CDR, metrice)
            // 记录到用户行为追踪队列
            this.behaviorTracking.push(metrice);
        }
    }

    /**
     * http请求上报
     * @memberof UserVitals
     */
    initHttpHandler = (): void => {
        const handler = (metrics: HttpMetrics) => {
            const metrice = {
                reportsType: MetricsName.HT,
                ...metrics,
            }
            this.add(MetricsName.HT, metrice)
            // 记录到用户行为追踪队列
            this.behaviorTracking.push(metrice);
        }
        proxyXmlHttp(null, handler)
        proxyFetch(null, handler)
    }
}