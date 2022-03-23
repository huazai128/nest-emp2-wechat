export const environment = process.env.NODE_ENV
export const isDevEnv = Object.is(environment, 'dev')
export const isProdEnv = Object.is(environment, 'prod')
export const isTestEnv = Object.is(environment, 'test')

export default {
    isDevEnv,
    isProdEnv,
    isTestEnv,
    environment,
}
