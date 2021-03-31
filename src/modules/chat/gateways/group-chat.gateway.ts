import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection
} from "@nestjs/websockets";

import {ExtendedSocket} from "@lib/typings";

@WebSocketGateway()
export class GroupChatGateway {}
