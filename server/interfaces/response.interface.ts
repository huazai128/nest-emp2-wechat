export type ResponseMessage = string
export enum ResponseStatus {
    Error = 'error',
    Success = 'success',
}

export interface HttpResponseBase {
    status: ResponseStatus
    message: ResponseMessage
}

export type ExceptionInfo =
    | ResponseMessage
    | {
        message: ResponseMessage
        error?: any
    }

// paginate data
export interface HttpPaginateResult<T> {
    data: T
}

// HTTP error
export type HttpResponseError = HttpResponseBase & {
    error: any
    debug?: string
}

// HTTP success
export type HttpResponseSuccess<T> = HttpResponseBase & {
    result: T | HttpPaginateResult<T>
} | {
    data: T
}

// HTTP response
export type HttpResponse<T> = HttpResponseError | HttpResponseSuccess<T>

