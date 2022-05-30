import { IMetrics, MPerformanceNavigationTiming, PerformanceEntryHandler } from "../interfaces"

export const supported = {
    performance: !!window.performance,
    getEntriesByType: !!(window.performance && window.performance.getEntriesByType),
    PerformanceObserver: 'PerformanceObserver' in window,
    MutationObserver: 'MutationObserver' in window,
    PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
};

window.performance = window.performance || window.msPerformance || window.webkitPerformance;

export const observe = (type: string, callback: PerformanceEntryHandler): PerformanceObserver | undefined => {
    try {
        // 类型合规，就返回 observe
        if (PerformanceObserver?.supportedEntryTypes?.includes(type)) {
            const ob: PerformanceObserver = new PerformanceObserver((l) => l.getEntries().map(callback));
            ob.observe({ entryTypes: ['resource'] }); // 兼容safari
            return ob;
        }
    } catch (error) {
    }
    return undefined;
};

export const afterLoad = (callback: any) => {
    if (document.readyState === 'complete') {
        setTimeout(callback);
    } else {
        window.addEventListener('pageshow', callback, { once: true, capture: true });
    }
};

/**
* FP
* @return {*} 
*/
export const getFP = async () => {
    return new Promise<IMetrics | undefined>((resolve, reject) => {
        if (supported.PerformanceObserver) {
            try {
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntriesByName('first-paint')) {
                        resolve(entry)
                    }
                }).observe({ type: 'paint', buffered: true });
                return false
            } catch (error) {
                // 在safari下获取为空数组
                const entryList = performance.getEntriesByName('first-paint');
                resolve(entryList[0])
            }
        } else {
            const entryList = performance.getEntriesByName('first-paint');
            resolve(entryList[0])
        }

    })
}

/**
* 获取NT
* @return {*}  {(MPerformanceNavigationTiming | undefined)}
*/
export const getNavigationTiming = (): MPerformanceNavigationTiming | undefined => {
    const resolveNavigationTiming = (entry: PerformanceNavigationTiming): MPerformanceNavigationTiming => {
        const {
            domainLookupStart,
            domainLookupEnd,
            connectStart,
            connectEnd,
            secureConnectionStart,
            requestStart,
            responseStart,
            responseEnd,
            domInteractive,
            domContentLoadedEventEnd,
            loadEventStart,
            fetchStart,
        } = entry;

        return {
            // 关键时间点
            FP: responseEnd - fetchStart, // 白屏时间	
            TTI: domInteractive - fetchStart, // 首次可交互时间
            DomReady: domContentLoadedEventEnd - fetchStart, // HTML加载完成时间也就是 DOM Ready 时间。
            Load: loadEventStart - fetchStart, // 页面完全加载时间	
            FirseByte: responseStart - domainLookupStart, // 首包时间	
            // 关键时间段
            DNS: domainLookupEnd - domainLookupStart, // DNS查询耗时	
            TCP: connectEnd - connectStart, // TCP连接耗时	
            SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0, // SSL安全连接耗时	
            TTFB: responseStart - requestStart, // 请求响应耗时	
            Trans: responseEnd - responseStart, // 内容传输耗时	
            DomParse: domInteractive - responseEnd, // DOM解析耗时	
            Res: loadEventStart - domContentLoadedEventEnd, // 资源加载耗时	
        };
    };

    const navigation =
        // W3C Level2  PerformanceNavigationTiming
        // 使用了High-Resolution Time，时间精度可以达毫秒的小数点好几位。
        performance.getEntriesByType('navigation').length > 0
            ? performance.getEntriesByType('navigation')[0]
            : performance.timing; // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。
    return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};

/**
* 获取资源resource加载性能
* @param {Array<PerformanceEntry>} resourceFlow
* @return {*}  {(PerformanceObserver | undefined)}
*/
export const getResourceFlow = (resourceFlow: Array<PerformanceEntry>): PerformanceObserver | undefined => {
    const entryHandler = (entry: PerformanceEntry) => {
        resourceFlow.push(
            // name 资源地址
            // startTime 开始时间
            // responseEnd 结束时间
            // time 消耗时间
            // initiatorType 资源类型
            // transferSize 传输大小
            // 请求响应耗时 ttfb = item.responseStart - item.startTime
            // 内容下载耗时 tran = item.responseEnd - item.responseStart
            // 但是受到跨域资源影响。除非资源设置允许获取timing
            entry,
        );
    };

    return observe('resource', entryHandler);
};