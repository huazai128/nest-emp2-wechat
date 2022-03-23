import { action, makeObservable, observable } from 'mobx'
import { StoreExt } from '@src/utils/reactExt';
export class AuthStore extends StoreExt {
    constructor() {
        super()
        makeObservable(this)
    }
    @observable userInfo = {}

    @action
    getUserInfo = () => {
        this.api.auth.getUserInfo({
            transformUrl: '/user/info',
            data: { name: 12, pass: 1212 }
        })
    }

    @action
    login = async (data: Record<string, string>, cb: () => void) => {
        const res = await this.api.auth.login({
            apiUrl: '/api/login',
            transformUrl: '/auth/login',
            data: { ...data },
        })
        if (res.userId) {
            this.$message.success('登录成功')
            cb()
        }
    }
}

export default new AuthStore()