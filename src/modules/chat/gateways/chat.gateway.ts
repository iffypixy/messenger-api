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
import {UserService} from "@modules/user";

@UseGuards(IsSocketAuthorizedGuard)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly service: GatewayService,
    private readonly userService: UserService
  ) {}

  async handleConnection(client: ExtendedSocket): Promise<void> {
    const userId = await this.service.getUserIdBySocket(client);

    client.userId = userId;
  }
}
