import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection
} from "@nestjs/websockets";
import {UseGuards} from "@nestjs/common";

import {ExtendedSocket} from "@lib/typings";
import {IsSocketAuthorizedGuard} from "@lib/guards";
import {GatewayService} from "@lib/services";

@UseGuards(IsSocketAuthorizedGuard)
@WebSocketGateway()
export class OneToOneChatGateway implements OnGatewayConnection {
  constructor(private readonly service: GatewayService) {}

  async handleConnection(client: ExtendedSocket): Promise<void> {
    const userId = await this.service.getUserIdBySocket(client);

    client.userId = userId;
  }
}
