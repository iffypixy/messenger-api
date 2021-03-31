import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import {WebsocketsAdapter} from "@lib/websockets";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: "http://localhost:3000",
      allowedHeaders: "*"
    }
  });

  app.setGlobalPrefix("/v1/api");
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.use(cookieParser());

  app.useWebSocketAdapter(
    new WebsocketsAdapter(app, {origin: "http://localhost:3000"})
  );

  await app.listen(process.env.PORT);
}

bootstrap();
