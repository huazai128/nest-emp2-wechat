import { FN1, MetricsName, PageInfo } from "./interfaces";
import { proxyHash, proxyHistory, wrHistory } from "./utils";
import Cookies from 'js-cookie'
import MetricsStore from "./metricsStore";

export default class SendLog extends MetricsStore {
    // 处理基本的页面信息，然后发送
    public pageInfo: PageInfo = {}
    public msObserver?: MutationObserver = undefined
    private curHref = ''
    private prevHref = ''
    private isLoaded: boolean
    private url: string
    constructor(url: string) {
        super()
        this.url = url
        this.isLoaded = false
        this.initPageInfo()
        this.initChangeConnection()
    }

    /**
     * 用于监听路由的变化，这样处理没办法获取路由跳转方式
     * @param {FN1} [cb]
     * @memberof SendLog
     */
    initRouterChange = (cb?: FN1) => {
        // 也可以用MutationObserver监听判断路由变化。
        wrHistory()
        const handler = (e: Event) => {
            this.dynamicInfo(e);
            setTimeout(() => {
                this.handleRoutineReport()
            }, 100)
            this.isLoaded = true
            cb?.(e)
        };

        window.addEventListener('pageshow', handler, { once: true, capture: true });
        proxyHash(handler);
        proxyHistory(handler);
    }


    /**
     * 初始化监听网络状态
     * @memberof SendLog
     */
    initChangeConnection = () => {
        const connection: any = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
            this.pageInfo = {
                ...this.pageInfo,
                effectiveType: connection.effectiveType
            }
            connection.addEventListener('change', () => {
                this.pageInfo = {
                    ...this.pageInfo,
                    effectiveType: connection.effectiveType
                }
            });
        }
    }

    /**
     * 初始化获取页面信息
     * @memberof SendLog
     */
    initPageInfo = () => {
        const userId = Cookies.get('userId') || ''
        const { width, height } = window.screen;
        const { language, userAgent } = navigator;
        this.pageInfo = {
            ...this.pageInfo,
            language: language.substr(0, 2),
            userAgent,
            winScreen: `${width}x${height}`,
            docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${document.documentElement.clientHeight || document.body.clientHeight
                }`,
            userId: userId,
        };
    }

    /**
     * 动态获取当前页面path和referrer
     * @memberof SendLog
     */
    dynamicInfo = (e?: Event) => {
        const { pathname, href } = window.location
        if (this.curHref != href) {
            this.prevHref = this.curHref
        }
        this.curHref = href
        this.pageInfo = {
            ...this.pageInfo,
            path: pathname,
            referrer: document.referrer,
            prevHref: this.prevHref,
            href,
            jumpType: e?.type || '',
            type: performance?.navigation?.type,

            // 用户来源
            // 0: 点击链接、地址栏输入、表单提交、脚本操作等。
            // 1: 点击重新加载按钮、location.reload。
            // 2: 点击前进或后退按钮。
            // 255: 任何其他来源。即非刷新/ 非前进后退、非点击链接 / 地址栏输入 / 表单提交 / 脚本操作等。
        }
        // 这里触发一下PV上报
    }

    /**
     * 通用的方法
     * @param {(MetricsName | string)} key
     * @memberof SendLog
     */
    handlerCommon = (key: MetricsName | string) => {
        if (!this.state.has(key)) {
            this.keys.push(key)
        }
        if (!this.isOver) {
            this.isOver = true
            this.handleRoutineReport()
        }
    }

    /**
     * 处理常规上报, 首次延迟100ms上报，防止抢占网络资源 
     * @memberof SendLog
     */
    handleRoutineReport = () => {
        const loop = () => {
            const key = this.keys[0]
            if (key) {
                const metrics = this.get(key)
                if (Array.isArray(metrics)) {
                    metrics.forEach((item) => {
                        this.sendLog(item)
                    })
                } else {
                    this.sendLog(metrics)
                }
                setTimeout(() => {
                    loop()
                }, 300)
            }
        }
        loop()
    }

    /**
     * 图片发送
     * @param {string} url
     * @memberof SendLog
     */
    sendImage = (url: string,) => {
        let img = new Image()
        const removeImage = function () {
            img = undefined as any
        }
        img.onload = removeImage
        img.onerror = removeImage
        img.src = `${url}`
    }

    /**
     * 发送日志
     * @param {*} params
     * @memberof SendLog
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    sendLog = (params: any) => {
        if (!this.isLoaded) {
            // 防止错误优先触发
            this.dynamicInfo()
        }
        params = {
            ...this.pageInfo,
            ...params,
        }
        // 这里要对数据进行处理才能发送
        console.log(params)
        // params = JSON.stringify()
        if (!!window.navigator?.sendBeacon) {
            window.navigator?.sendBeacon(this.url, params)
        } else {
            this.sendImage(this.url)
        }
    }
}