import { Module } from "@nestjs/common";
import { RouterController } from "./router.controller";
import { RouterSercive } from "./router.service";

@Module({
    controllers: [RouterController],
    providers: [RouterSercive]
})
export class RouterModule { }