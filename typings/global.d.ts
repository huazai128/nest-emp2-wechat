declare interface Window {
    INIT_DATA: Record<string, any>
}

/**
 * 全局Store
 * @interface IStore
 */
interface IStore {
    globalStore: IGlobalStore.GlobalStore
    authStore: IAuthStore.AuthStore
}