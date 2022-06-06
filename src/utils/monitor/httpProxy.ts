import { FN1, HttpMetrics } from "./interfaces";

// 调用 proxyXmlHttp 即可完成全局监听 XMLHttpRequest
export const proxyXmlHttp = (sendHandler: FN1 | null | undefined, loadHandler: FN1) => {
    if ('XMLHttpRequest' in window && typeof window.XMLHttpRequest === 'function') {
        const oXMLHttpRequest = window.XMLHttpRequest;
        if (!(window as any).oXMLHttpRequest) {
            // oXMLHttpRequest 为原生的 XMLHttpRequest，可以用以 SDK 进行数据上报，区分业务
            (window as any).oXMLHttpRequest = oXMLHttpRequest;
        }
        (window as any).XMLHttpRequest = () => {
            // 覆写 window.XMLHttpRequest
            const xhr = new oXMLHttpRequest();
            const { open, send } = xhr;
            let metrics = {} as HttpMetrics;
            xhr.open = (method, url) => {
                metrics.method = method;
                metrics.url = url;
                open.call(xhr, method, url, true);
            };
            xhr.send = (body) => {
                metrics.body = body || '';
                metrics.requestTime = new Date().getTime();
                // sendHandler 可以在发送 Ajax 请求之前，挂载一些信息，比如 header 请求头
                // setRequestHeader 设置请求header，用来传输关键参数等
                // xhr.setRequestHeader('xxx-id', 'VQVE-QEBQ');
                if (typeof sendHandler === 'function') sendHandler(xhr);
                send.call(xhr, body);
            };
            // 请求结束
            xhr.addEventListener('loadend', () => {
                const { status, statusText, response } = xhr;
                metrics = {
                    ...metrics,
                    status,
                    statusText,
                    response,
                    responseTime: new Date().getTime(),
                };
                if (typeof loadHandler === 'function') loadHandler(metrics);
                // xhr.status 状态码
                // 如果 xhr.status 为 500\404等，就是有异常，调用异常上报即可
            });
            return xhr;
        };
    }
};

// 调用 proxyFetch 即可完成全局监听 fetch
export const proxyFetch = (sendHandler: FN1 | null | undefined, loadHandler: FN1) => {
    if ('fetch' in window && typeof window.fetch === 'function') {
        const oFetch = window.fetch;
        if (!(window as any).oFetch) {
            (window as any).oFetch = oFetch;
        }
        (window as any).fetch = async (input: any, init: RequestInit) => {
            // init 是用户手动传入的 fetch 请求互数据，包括了 method、body、headers，要做统一拦截数据修改，直接改init即可
            if (typeof sendHandler === 'function') sendHandler(init);
            let metrics = {} as HttpMetrics;

            metrics.method = init?.method || '';
            metrics.url = (input && typeof input !== 'string' ? input?.url : input) || ''; // 请求的url
            metrics.body = init?.body || '';
            metrics.requestTime = new Date().getTime();

            return oFetch.call(window, input, init).then(async (response) => {
                // clone 出一个新的 response,再用其做.text(),避免 body stream already read 问题
                const res = response.clone();
                metrics = {
                    ...metrics,
                    status: res.status,
                    statusText: res.statusText,
                    response: await res.text(),
                    responseTime: new Date().getTime(),
                };
                if (typeof loadHandler === 'function') loadHandler(metrics);
                return response;
            });
        };
    }
};
