import { config } from '@app/config';
import { HttpRequest } from '@app/interfaces/request.interface';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

/**
 * 拼接转发接口
 * @export
 * @class TransformPipe
 * @implements {PipeTransform<HttpRequest, HttpRequest>}
 */
@Injectable()
export class TransformPipe implements PipeTransform<HttpRequest, HttpRequest> {
    transform(data: HttpRequest, metadata: ArgumentMetadata): HttpRequest {
        const apiTransferType: any = data.apiTransferType || 'baseApi'
        const transferUrl = data.transformUrl || {}
        const url = config.apiPrefix[apiTransferType] + transferUrl
        return {
            ...data,
            transformUrl: url
        }
    }
}