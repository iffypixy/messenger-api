import {Global, Module} from "@nestjs/common";

import {WebsocketsService} from "./websockets.service";

@Global()
@Module({
  providers: [WebsocketsService],
  exports: [WebsocketsService]
})
export class WebsocketsModule {
}