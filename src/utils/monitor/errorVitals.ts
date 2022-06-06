import SendLog from "./send";

export default class ErrorVitals extends SendLog {
    private submitErrorUids: Array<string>;
    constructor() {
        super()
        this.submitErrorUids = []
        this.initJsError()
        console.log('1212')
    }

    initJsError = () => {
        const handler = (event: ErrorEvent) => {
            console.log(event, '====')
        }
        window.onerror = (msg, url, row, col, error) => {
            console.log(msg, url, row, col, error)
        }
        window.addEventListener('error', () => handler, true)
    }

}