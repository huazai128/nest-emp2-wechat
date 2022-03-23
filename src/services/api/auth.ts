import http, { HttpParams } from '@src/services/http'

function login<T>(data: HttpParams): Promise<any> {
    return http.post<T>(data)
}

function getUserInfo<T>(data: HttpParams): Promise<any> {
    return http.get<T>(data)
}

export default {
    login,
    getUserInfo,
}
