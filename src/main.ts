import { ValidationPipe } from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  await app.listen(process.env.PORT);

}

bootstrap();
