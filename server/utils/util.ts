import { networkInterfaces } from 'os';
import { Base64 } from 'js-base64';
import { createHash } from 'crypto';

/**
 * 获取服务端IP
 * @export
 * @return {*}
 */
export function getServerIp() {
    const interfaces = networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName] as Array<any>;
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (
                alias.family === 'IPv4' &&
                alias.address !== '127.0.0.1' &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}

/**
 * Base64 编码
 * @export
 * @param {string} value
 * @return {*}  {string}
 */
export function decodeBase64(value: string): string {
    return value ? Base64.decode(value) : value;
}

/**
 * md5 编码
 * @export
 * @param {string} value
 * @return {*}  {string}
 */
export function decodeMd5(value: string): string {
    return createHash('md5').update(value).digest('hex');
}
