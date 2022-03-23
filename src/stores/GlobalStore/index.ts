import { action, observable, makeObservable } from 'mobx'

export class GlobalStore {
    constructor() {
        makeObservable(this)
    }

    @observable num = 1

    @action
    updateNum = () => {
        this.num += 1
    }
}

export default new GlobalStore();