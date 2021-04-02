import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import {WebsocketsAdapter} from "@modules/websockets";
import {AppModule} from "./app.module";

async function bootstrap() {
  const cors = {
    origin: "http://localhost:3000"
  };

  const app = await NestFactory.create(AppModule, {cors});

  app.setGlobalPrefix("/v1/api");
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.use(cookieParser());

  app.useWebSocketAdapter(new WebsocketsAdapter(app, cors));

  await app.listen(process.env.PORT);
}

bootstrap();
