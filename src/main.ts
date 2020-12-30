import { ValidationPipe } from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import {SocketIoAdapter} from "@lib/adapters";
import {AppModule} from "./app.module";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsOptions
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketIoAdapter(app, true));

  await app.listen(process.env.PORT);
}

bootstrap();
