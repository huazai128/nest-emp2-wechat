import { Lang, ScopeEnum } from "@app/constants/text.constant";
import { Injectable } from "@nestjs/common";
import {ApiConfigKit,HttpKit } from 'tnwx'
import util from 'util'

@Injectable()
export class WechatService{
    private authorizeUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s";
    private accessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code"
    private refreshTokenUrl = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=%s&grant_type=refresh_token&refresh_token=%s"
    private userInfoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=%s";
    private checkTokenUrl = "https://api.weixin.qq.com/sns/auth?access_token=%s&openid=%s";

     /**
     * 获取授权链接
     * @param redirectUri 回调地址
     * @param scope 
     * @param state 
     */
      public getAuthorizeUrl(redirectUri: string, scope: ScopeEnum, state?: string): string {
        let url = util.format(this.authorizeUrl, ApiConfigKit.getApiConfig.getAppId, encodeURIComponent(redirectUri), scope);
        if (state) {
            url = url + "&state=" + state;
        }
        console.log(url, 'url')
        return url + "#wechat_redirect";
    }
    /**
     * 通过code换取网页授权access_token
     * @param code 
     */
    public  async getSnsAccessToken(code: string) {
        const url = util.format(this.accessTokenUrl, ApiConfigKit.getApiConfig.getAppId,
            ApiConfigKit.getApiConfig.getAppScrect, code);
        return HttpKit.getHttpDelegate.httpGet(url);
    }


    /**
     * 刷新access_token
     * @param refreshToken 
     */
    public async refreshAccessToken(refreshToken: string) {
        const url = util.format(this.refreshTokenUrl, ApiConfigKit.getApiConfig.getAppId, refreshToken);
        return HttpKit.getHttpDelegate.httpGet(url);
    }

    /**
     * 检验授权凭证（access_token）是否有效
     * @param accessToken 通过code换取的access_token
     * @param openId 
     */
     public async checkAccessToken(accessToken: string, openId: string) {
        const url = util.format(this.checkTokenUrl, accessToken, openId);
        return HttpKit.getHttpDelegate.httpGet(url);
    }

    /**
     * 拉取用户信息(需scope为 snsapi_userinfo)
     * @param accessToken 
     * @param openId 
     * @param lang 
     */
    public async getUserInfo(accessToken: string, openId: string, lang: Lang) {
        const url = util.format(this.userInfoUrl, accessToken, openId, lang);
        return HttpKit.getHttpDelegate.httpGet(url);
    }






}