"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
const websocket_1 = require("./lib/websocket");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const cors = {
        origin: process.env.ORIGIN,
        credentials: true
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors });
    app.use(cookieParser());
    app.useWebSocketAdapter(new websocket_1.WebsocketAdapter(app, cors));
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.setGlobalPrefix("/v1");
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map