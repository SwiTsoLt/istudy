import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as config from "config";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
    const PORT: string | undefined = process.env["PORT"] ?? config.get("PORT") ?? "3000";

    const app = await NestFactory.create(AppModule);
    await app.listen(PORT);
}
bootstrap();
