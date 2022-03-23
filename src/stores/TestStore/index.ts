import { makeAutoObservable } from 'mobx'

export class TestStore {
    constructor() {
        makeAutoObservable(this) // 个人喜欢装饰器写法
    }
}

export default new TestStore()