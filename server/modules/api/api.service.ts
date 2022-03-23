import { HttpRequest } from "@app/interfaces/request.interface";
import { AxiosService } from "@app/processors/axios/axios.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiService {
    constructor(private readonly axiosService: AxiosService) { }

    public async get({ transformUrl, transferData }: HttpRequest): Promise<any> {
        return this.axiosService.get(transformUrl, transferData)
    }

    public async post({ transformUrl, transferData }: HttpRequest): Promise<any> {
        return this.axiosService.post(transformUrl, transferData)
    }
}