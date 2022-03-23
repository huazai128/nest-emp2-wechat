import RouterComp from '@src/components/RouterComp'
import { RouterCompProps } from '@src/types'
import '@src/styles/flex.scss'
import 'antd/dist/antd.css';
import './App.scss'

const App = (props: RouterCompProps) => <RouterComp {...props} />

export default App
