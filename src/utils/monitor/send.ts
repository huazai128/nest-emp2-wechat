import { PageInfo } from "./interfaces";
import Cookies from 'js-cookie'
import { afterLoad } from "./utils";

export default class SendLog {
    // 处理基本的页面信息，然后发送
    private pageInfo: PageInfo
    constructor() {
        this.pageInfo = this.initPageInfo();
        window.addEventListener('pageshow', this.dynamicInfo, { once: true, capture: true });

    }

    initPageInfo = (): PageInfo => {
        const userId = Cookies.get('userId') || ''
        const { width, height } = window.screen;
        const { language, userAgent } = navigator;
        return {
            language: language.substr(0, 2),
            userAgent,
            winScreen: `${width}x${height}`,
            docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${document.documentElement.clientHeight || document.body.clientHeight
                }`,
            userId: userId,
        };
    }


    dynamicInfo = () => {
        const { pathname, href, } = window.location
    }


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

    sendLog = (url: string, params: any) => {
        if (!!window.navigator?.sendBeacon) {
            window.navigator?.sendBeacon(url, params)
        } else {
            this.sendImage(url, params)
        }
    }
}