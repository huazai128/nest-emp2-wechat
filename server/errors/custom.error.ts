import { ExceptionInfo } from "@app/interfaces/response.interface";
import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * @export
 * @class CustomError
 * @extends {HttpException}
 * @example new CustomError({ message: 'error message' }, 400)
 */
export class CustomError extends HttpException {
    constructor(options: ExceptionInfo, statusCode?: HttpStatus) {
        super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
    }
}