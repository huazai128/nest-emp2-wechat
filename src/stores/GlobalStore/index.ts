import { action, observable, makeObservable } from 'mobx'

export class GlobalStore {
    constructor() {
        makeObservable(this)
    }
    
    // PC 端下获取参数
    @observable wxConfig = window.INIT_DATA?.wxConfig || {}

    // 微信内核下的js 配置
    @observable jsConfig = window.INIT_DATA?.jsConfig || {}

    @observable num = 1

    @action
    updateNum = () => {
        this.num += 1
    }
}

export default new GlobalStore();