export interface IMetrics {
    [prop: string | number]: any;
}

export enum MetricsName {
    FP = 'first-paint',
    FCP = 'first-contentful-paint',
    NT = 'navigation-timing',
    RF = 'resource-flow',
    PI = 'page-information',
    OI = 'origin-information',
    RCR = 'router-change-record',
    CBR = 'click-behavior-record',
    CDR = 'custom-define-record',
    HT = 'http-record',
}

export interface PageInfo {
    // 浏览器的语种 (eg:zh) ;
    language: string;
    // 用户 userAgent 信息
    userAgent?: string;
    // 屏幕宽高 
    winScreen: string;
    // 文档宽高 
    docScreen: string;
    // 用户ID
    userId: string
}


export interface PerformanceEntryHandler {
    (entry: any): void;
}

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
