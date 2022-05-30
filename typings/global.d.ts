declare interface Window {
    INIT_DATA: Record<string, any>
    msPerformance: Record<string, any>
    webkitPerformance: Record<string, any>
}

/**
 * 全局Store
 * @interface IStore
 */
declare interface IStore {
    globalStore: IGlobalStore.GlobalStore
    authStore: IAuthStore.AuthStore
}

declare const WxLogin: any

