import { useEffect } from 'react'
import { WechatLogin } from '@src/utils/wxConfig'
import useRootStore from '@src/stores/useRootStore'
import HostApp from '@microHost/App'
import { Button } from '@microHost/Button'
import config from '@src/config'
import './index.scss'
import { useHistory } from 'react-router-dom'

const Hello = () => {
    const { globalStore, authStore } = useRootStore()
    const history = useHistory()
    useEffect(() => {
        authStore.getUserInfo()
        document.addEventListener('click', (e) => {
            console.log('监听到了', e.target)
        })
    }, [])


    useEffect(() => {
        const { appId } = globalStore.wxConfig
        const url = `${config.apiHost}/wx/auth?redirect_uri=${encodeURIComponent(location.href)}`
        WechatLogin.initLogin(appId, 'wxLogin-qr', url)
    }, [])

    return (
        <div className="App flex-col flex-center" >
            <Button customLabel="跳转页面" onClick={() => {
                history.push('/list')
            }}></Button>
            <HostApp />
            <Button customLabel="新增的组件需要重新编译" onClick={() => {
                console.log('点击时间')
            }} />
            <h1>欢迎来到nest+emp2</h1>
            <div id="wxLogin-qr">

            </div>
        </div>
    )
}

export default Hello
