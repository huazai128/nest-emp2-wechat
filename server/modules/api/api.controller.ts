import { QueryParams } from '@app/decorators/params.decorator';
import { Responsor } from '@app/decorators/responsor.decorator';
import { ApiGuard } from '@app/guards/api.guard';
import { HttpRequest } from '@app/interfaces/request.interface';
import { TransformPipe } from '@app/pipes/transform.pipe';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiConstroller {

    constructor(private readonly apiService: ApiService) { }

    /**
     * Get 接口转发
     * @param {HttpRequest} data
     * @return {*} 
     * @memberof ApiConstroller
     */
    @UseGuards(ApiGuard)
    @Responsor.api()
    @Get('transform')
    getTransform(@QueryParams('query', new TransformPipe()) data: HttpRequest) {
        return this.apiService.get(data)
    }

    /**
     * Post 接口转发
     * @param {HttpRequest} data
     * @return {*} 
     * @memberof ApiConstroller
     */
    @UseGuards(ApiGuard)
    @Responsor.api()
    @Post('transform')
    postTransform(@Body(new TransformPipe()) data: HttpRequest) {
        return this.apiService.post(data)
    }
}