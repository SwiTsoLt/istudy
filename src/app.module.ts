import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { GatewayModule } from "./gateway/gateway.module";

const staticPath = join(__dirname, "../../", "client", "dist", "client");

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: staticPath,
        }),
        GatewayModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
