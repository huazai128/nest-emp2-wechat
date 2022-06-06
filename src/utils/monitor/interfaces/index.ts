import BehaviorStore from "../behaviorStore";

/* eslint-disable @typescript-eslint/ban-types */
export interface IMetrics {
    [prop: string | number]: any;
}

export enum MetricsName {
    RCR = 'router-change-record',
    CBR = 'click-behavior-record',
    CDR = 'custom-define-record',
    HT = 'http-record',
    CE = 'change-exposure',
}

export interface PageInfo {
    // 浏览器的语种 (eg:zh) 
    language?: string
    // 用户 userAgent 信息
    userAgent?: string
    // 屏幕宽高 
    winScreen?: string
    // 文档宽高 
    docScreen?: string
    // 用户ID
    userId?: string
    // 标题
    title?: string
    // 路由
    path?: string
    // href
    href?: string
    // referrer
    referrer?: string
    // prevHref
    prevHref?: string
    // 跳转方式
    jumpType?: string
    // 用户来源方式
    type?: number
}


export interface PerformanceEntryHandler {
    (entry: any): void;
}

export type FN = () => void
export type FN1 = (e: any) => void

export interface MPerformanceNavigationTiming {
    FP?: number;
    TTI?: number;
    DomReady?: number;
    Load?: number;
    FirseByte?: number;
    DNS?: number;
    TCP?: number;
    SSL?: number;
    TTFB?: number;
    Trans?: number;
    DomParse?: number;
    Res?: number;
}

export interface BehaviorRecordsOptions {
    maxBehaviorRecords: number;
}

export interface BehaviorStack {
    name: MetricsName;
    value: any;
}


export interface CustomAnalyticsData {
    // 事件类别 互动的对象 eg:Video
    eventCategory: string;
    // 事件动作 互动动作方式 eg:play
    eventAction: string;
    // 事件标签 对事件进行分类 eg:
    eventLabel: string;
    // 事件值 与事件相关的数值   eg:180min
    eventValue?: string;
}

export interface HttpMetrics {
    method: string;
    url: string | URL;
    body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream;
    requestTime: number;
    responseTime: number;
    status: number;
    statusText: string;
    response?: any;
}

export enum MechanismType {
    JS = 'js',
    RS = 'resource',
    UJ = 'unhandledrejection',
    HP = 'http',
    CS = 'cors',
    REACT = 'react'
}

export interface ExceptionMetrics {
    errorType: string;
    value?: string;
    type: string;
    stackTrace?: Object;
    breadcrumbs?: Array<BehaviorStack>;
    errorUid: string;
    meta?: any;
}


export interface SendExtend {
    sendLog: (params: any) => void
    behaviorTracking?: BehaviorStore
}


