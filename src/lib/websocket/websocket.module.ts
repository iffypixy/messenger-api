import {Global, Module} from "@nestjs/common";

import {WebsocketService} from "./websocket.service";

@Global()
@Module({
  providers: [WebsocketService],
  exports: [WebsocketService]
})
export class WebsocketModule {
}