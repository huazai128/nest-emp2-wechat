/**
 * 微信扫码登录
 * @export
 * @class WechatLogin
 */
export class WechatLogin {
    public static initLogin(appID: string, id: string, url: string){
        const obj = new WxLogin({
            self_redirect:true,
            id: id, 
            appid: appID, 
            scope: 'snsapi_login', 
            redirect_uri: url,
            state: "wxLogin",
            style: "",
            href: ""
        }) 
    }
}