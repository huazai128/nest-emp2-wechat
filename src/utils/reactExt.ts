import { message, notification } from 'antd'
import * as api from '@src/services/api'

export class StoreExt {
    readonly api = api
    readonly $message = message
    readonly $notification = notification
}
