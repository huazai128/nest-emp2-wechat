import { Injectable } from "@nestjs/common";
import { HttpRequest } from "@app/interfaces/request.interface";
import { AxiosService } from "@app/processors/axios/axios.service";
import { AUTH, config } from "@app/config";
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthService {

    constructor(private readonly axiosService: AxiosService, private readonly jwtService: JwtService) { }

    /**
     * 生成token
     * @param {*} data
     * @return {*} 
     * @memberof AuthService
     */
    creatToken(data: any) {
        const token = {
            access_token: this.jwtService.sign({ data }),
            expires_in: AUTH.expiresIn as number,
        }
        return token
    }

    /**
     * 验证用户
     * @param {*} { id }
     * @return {*} 
     * @memberof AuthService
     */
    public async validateUser({ id, username }: any) {
        // 获取用户
        const user = await this.findById(id);
        return user
    }

    /**
     * 登录
     * @param {HttpRequest} { transformUrl, transferData }
     * @return {*}  {Promise<any>}
     * @memberof AuthService
     */
    public async login({ transformUrl, transferData }: HttpRequest): Promise<any> {
        const res = await this.axiosService.post(transformUrl, transferData) as any
        const token = this.creatToken({ usernmae: res.account, userId: res.userId })
        return { ...res, ...token }
    }


    /**
     * 根据ID查询用户
     * @param {*} id
     * @return {*}  {Promise<any>}
     * @memberof AuthService
     */
    public async findById(id): Promise<any> {
        const url = config.apiPrefix.baseApi + '/user/info'
        const res = await this.axiosService.get(url, { params: { id: id } })
        return res
    }
}