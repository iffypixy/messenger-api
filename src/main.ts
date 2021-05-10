import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import {WebsocketsAdapter} from "@lib/websockets";
import {AppModule} from "./app.module";

const origin = "http://localhost:3000";

async function bootstrap() {
  const cors = {origin};

  const app = await NestFactory.create(AppModule, {cors});

  app.use(cookieParser());
  app.useWebSocketAdapter(new WebsocketsAdapter(app, cors));
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.setGlobalPrefix("/v1/api");

  await app.listen(process.env.PORT);
}

bootstrap();
