import React, { Component, ErrorInfo, ComponentType } from 'react'

interface IState {
    hasError: boolean
}

/**
 * 用于处理React 组件 错误，并上报错误
 * @template T
 * @param {*} WrappedComponent
 * @param {string} name 组件名称， 在webpack打包后无法获取组件name
 * @return {*} 
 */
function ErrorBoundaryHoc<T>(WrappedComponent: any, name: string) {
    return class extends Component<T, IState> {
        constructor(props: T) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error: any) {
            // 更新 state 使下一次渲染能够显示降级后的 UI
            return { hasError: true };
        }

        componentDidCatch(error: Error, errorInfo: ErrorInfo) {
            // 错误日志上报
            window.monitor?.initReactError(error, { ...errorInfo, componentName: name })
        }

        render() {
            if (this.state.hasError) {
                // 你可以自定义降级后的 UI 并渲染
                return <h1>错误的组件</h1>;
            }

            return <WrappedComponent  {...this.props as T} />;
        }
    }
}

export default ErrorBoundaryHoc
