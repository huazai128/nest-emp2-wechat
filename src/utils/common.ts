/**
 * 解决画卡、下载图片跨域问题
 * @export
 * @param {string} api
 * @return {*} 
 */
export function imageProxy(api: string) {
    return function (url: string) {
        if (url != '') {
            if (/^data:image\/\w+;base64,/.test(url)) {
                return url
            } else {
                return api + encodeURIComponent(url);
            }
        } else {
            return '';
        }

    }
}
