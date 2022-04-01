import { useEffect } from 'react'
import { WechatLogin } from '@src/utils/wxConfig'
import useRootStore from '@src/stores/useRootStore'
import config from '@src/config'
import './index.scss'

const Hello = () => {
    const { globalStore } = useRootStore()

    useEffect(() => {
        const { appId } = globalStore.wxConfig
        const url = `${config.apiHost}/wx/auth?redirect_uri=${encodeURIComponent(location.href)}`
        WechatLogin.initLogin(appId, 'wxLogin-qr', url)
    }, [])

    return (
        <div className="App flex-col flex-center">
            <h1>欢迎来到nest+emp2</h1>
            <div id="wxLogin-qr">

            </div>
        </div>
    )
}

export default Hello
