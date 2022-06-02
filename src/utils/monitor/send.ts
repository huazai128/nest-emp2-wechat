import { FN1, PageInfo } from "./interfaces";
import Cookies from 'js-cookie'
import { proxyHash, proxyHistory, wrHistory } from "./utils";

export default class SendLog {
    // 处理基本的页面信息，然后发送
    public pageInfo: PageInfo = {}
    public msObserver?: MutationObserver = undefined
    private curHref = ''
    private prevHref = ''
    constructor() {
        this.initPageInfo()
    }

    // 用于监听路由的变化，这样处理没办法获取路由跳转方式
    initRouterChange = (cb?: FN1) => {
        // 也可以用MutationObserver监听判断路由变化。
        wrHistory()
        const handler = (e: Event) => {
            this.dynamicInfo(e);
            cb?.(e)
        };
        window.addEventListener('pageshow', handler, { once: true, capture: true });
        proxyHash(handler);
        proxyHistory(handler);
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
        // this.sendLog()
    }

    /**
     * 图片发送
     * @param {string} url
     * @param {object} params
     * @memberof SendLog
     */
    sendImage = (url: string, params: object) => {
        const img = new Image()
        img.style.display = 'none'
        const removeImage = function () {
            img.parentNode?.removeChild(img)
        }
        img.onload = removeImage
        img.onerror = removeImage
        img.src = `${url}`
        document.body.appendChild(img)
    }

    /**
     * 发送日志
     * @param {string} url
     * @param {*} params
     * @memberof SendLog
     */
    sendLog = (url: string, params: any) => {
        if (!!window.navigator?.sendBeacon) {
            window.navigator?.sendBeacon(url, params)
        } else {
            this.sendImage(url, params)
        }
    }
}