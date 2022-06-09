import ReactDOM from 'react-dom'
import App from './App'
import { RootStoreProvider } from '@src/components/StoreProvider'
import * as stores from '@src/stores/index'

import Monitor from '@src/utils/monitor'
window.monitor = new Monitor({ url: '' })

ReactDOM.render(
    <RootStoreProvider store={stores}>
        <App />
    </RootStoreProvider>,
    document.getElementById('emp-root'),
)
