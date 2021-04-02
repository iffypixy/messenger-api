import {Module} from "@nestjs/common";

import {AuthModule} from "@modules/auth";
import {WebsocketsGateway} from "./websockets.gateway";
import {WebsocketsService} from "./websockets.service";

@Module({
  imports: [AuthModule],
  providers: [WebsocketsGateway, WebsocketsService],
  exports: [WebsocketsGateway, WebsocketsService]
})
export class WebsocketsModule {}
