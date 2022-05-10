import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express'
import { get } from "lodash";
import request from 'request';

/**
 * 工具类接口
 * @export
 * @class AppController
 */
@Controller('api')
export class AppController {

    // 图片跨域
    @Get("image-proxy")
    imageProxy(@Req() req: Request, @Res() res: Response) {
        const url: string = get(req, 'query.url');
        console.log(!url || !/^https?:\/\//.test(url), '======')
        if (!url || !/^https?:\/\//.test(url)) {
            return res.status(500).send({
                status: 500,
                message: '无效的图片地址',
            })
        }
        const stream: any = request({ url });
        req.pipe(stream)
        stream.on('error', err => {
            return res.status(500).send({
                status: 500,
                message: err.message,
            })
        });
        return stream.pipe(res);
    }
}
