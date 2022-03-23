import ReactDOM from 'react-dom'
import App from './App'
import { RootStoreProvider } from '@src/components/StoreProvider'
import * as stores from '@src/stores/index'

ReactDOM.render(
     <RootStoreProvider store={stores}>
        <App />
    </RootStoreProvider>,
  document.getElementById('emp-root'),
)
