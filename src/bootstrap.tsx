import ReactDOM from 'react-dom'
import App from './App'
import { RootStoreProvider } from '@src/components/StoreProvider'
import * as stores from '@src/stores/index'
import 'intersection-observer'
import 'mutationobserver-polyfill'
import '@fastly/performance-observer-polyfill/polyfill'
import Monitor from '@src/utils/monitor'
const monitor = new Monitor()

ReactDOM.render(
    <RootStoreProvider store={stores}>
        <App />
    </RootStoreProvider>,
    document.getElementById('emp-root'),
)
