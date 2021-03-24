import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/v1/api");
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  app.use(cookieParser());

  await app.listen(process.env.PORT);
}

bootstrap();
