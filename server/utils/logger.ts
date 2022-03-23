import chalk from 'chalk'

enum LoggerLevel {
    Debug = 'debug',
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
}

const renderTime = () => {
    const now = new Date()
    return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`
}

const renderModule = (message: string) => {
    if (typeof message === 'string' && message.startsWith('[') && message.endsWith(']')) {
        return chalk.green.underline(message.substr(1, message.length - 2))
    } else {
        return message
    }
}

const renderMessage = (color: any, messages: any[]) => {
    return messages.map((m) => (typeof m === 'string' ? color(m) : m))
}

const renderLog = (method: LoggerLevel, levelLabel: string, messageColor: any) => {
    return (message: any, ...args: any) => {
        return console[method](
            chalk.greenBright(`[NEST]`),
            renderTime(),
            levelLabel,
            renderModule(message),
            ...renderMessage(messageColor, args)
        )
    }
}

const createLogger = () => {
    return {
        debug: renderLog(LoggerLevel.Debug, chalk.cyan('[DEBUG]'), chalk.cyanBright),
        info: renderLog(LoggerLevel.Info, chalk.blue('[_INFO]'), chalk.greenBright),
        warn: renderLog(LoggerLevel.Warn, chalk.yellow('[_WARN]'), chalk.yellowBright),
        error: renderLog(LoggerLevel.Error, chalk.red('[ERROR]'), chalk.redBright),
    }
}

const logger = createLogger()

export default logger