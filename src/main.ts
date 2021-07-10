import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";

import {WebsocketAdapter} from "@lib/websocket";
import {AppModule} from "./app.module";

async function bootstrap() {
  const cors: CorsOptions = {
    origin: process.env.ORIGIN,
    credentials: true
  };

  const app = await NestFactory.create(AppModule, {cors});

  app.use(cookieParser());
  app.useWebSocketAdapter(new WebsocketAdapter(app, cors));
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.setGlobalPrefix("/v1/api");

  await app.listen(process.env.PORT);
}

bootstrap();
