import { AxiosService } from "@app/processors/axios/axios.service";
import { Injectable } from "@nestjs/common";

/**
 * 处理路由下各种数据
 * @export
 * @class RouterSercive
 */
@Injectable()
export class RouterSercive {
    constructor(private readonly axiosSerice: AxiosService) { }

}