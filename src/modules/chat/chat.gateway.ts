import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection
} from "@nestjs/websockets";
import {UseGuards} from "@nestjs/common";

import {ExtendedSocket} from "@lib/typings";
import {IsSocketAuthorizedGuard} from "@lib/guards";
import {ChatGatewayService} from "./services";
import {events} from "./lib/gateway-events";

@UseGuards(IsSocketAuthorizedGuard)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly service: ChatGatewayService) {}

  async handleConnection(client: ExtendedSocket): Promise<void> {
    const userId = await this.service.getUserIdBySocket(client);

    client.userId = userId;
  }
}
