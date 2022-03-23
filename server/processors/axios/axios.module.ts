import { AXIOS_INSTANCE_TOKEN } from "@app/constants/axios.constant";
import { Global, Module } from "@nestjs/common";
import { AxiosService } from "./axios.service";
import axios from 'axios'
@Global()
@Module({
    providers: [
        AxiosService,
        {
            provide: AXIOS_INSTANCE_TOKEN, // 注入一个服务
            useValue: axios
        }
    ],
    exports: [AxiosService]
})
export class AxiosModule { }