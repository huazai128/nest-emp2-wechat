import { Module } from "@nestjs/common";
import { ApiConstroller } from "./api.controller";
import { ApiService } from "./api.service";

@Module({
    imports: [],
    controllers: [ApiConstroller],
    providers: [ApiService]
})
export class ApiModule { }