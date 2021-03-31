import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection
} from "@nestjs/websockets";

import {ExtendedSocket} from "@lib/typings";
import {ChatGatewayService} from "../services";

@WebSocketGateway()
export class GroupChatGateway implements OnGatewayConnection {
  constructor(private readonly service: ChatGatewayService) {}

  async handleConnection(client: ExtendedSocket): Promise<void> {
    const userId = await this.service.getUserIdBySocket(client);

    client.userId = userId;
  }
}
