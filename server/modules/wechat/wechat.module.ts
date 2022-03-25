import { Module, OnModuleInit } from "@nestjs/common";
import { WechatController } from "./wechat.controller";
import { WechatService } from "./wechat.service";
import { ApiConfigKit, ApiConfig } from 'tnwx'
import { config } from "@app/config";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [WechatController],
    providers: [WechatService],
    exports: [WechatService]
})
export class WechatModule implements OnModuleInit{
    onModuleInit() {
        const devApiConfig = new ApiConfig(config.wxConfig.appId, config.wxConfig.appScrect,config.wxConfig.token);
        // 微信公众号、微信小程序、微信小游戏 支持多应用
        ApiConfigKit.putApiConfig(devApiConfig);
        // 开启开发模式,方便调试
        ApiConfigKit.devMode = true;
        // 设置当前应用
        ApiConfigKit.setCurrentAppId(devApiConfig.getAppId);
    }
}