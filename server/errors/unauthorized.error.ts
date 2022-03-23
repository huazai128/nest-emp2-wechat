import { ResponseMessage } from "@app/interfaces/response.interface";
import { UnauthorizedException } from "@nestjs/common";
import { HTTP_UNAUTHORIZED_TEXT_DEFAULT } from "@app/constants/text.constant";


/**
 *  未授权 401
 * @export 
 * @class HttpUnauthorizedError
 * @extends {UnauthorizedException}
 */
export class HttpUnauthorizedError extends UnauthorizedException {
    constructor(message?: ResponseMessage, error?: any) {
        super(message || HTTP_UNAUTHORIZED_TEXT_DEFAULT, error)
    }
}