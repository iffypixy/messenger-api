import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from "@nestjs/websockets";
import {Server} from "socket.io";

import {MessagePublicData} from "../entity";
import {IExtendedSocket} from "../interfaces";

interface HandleCredentialsData {
  userId: string;
}

interface HandleCreateMessage {
  recipientId: string;
  message: MessagePublicData;
}

interface HandleReadMessages {
  recipientId: string;
  ids: string[];
}

@WebSocketGateway({origins: "http://localhost:3000"})
export class DialogGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("credentials")
  handleCredentials(
    @MessageBody()
    {userId}: HandleCredentialsData,
    @ConnectedSocket()
    client: IExtendedSocket
  ): any {
    client.userId = userId;
  }

  @SubscribeMessage("message")
  handleCreateMessage(
    @MessageBody() {recipientId, message}: HandleCreateMessage
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient) this.server.to(recipient.id).emit("message", {message});
  }

  @SubscribeMessage("read-messages")
  handleReadMessages(
    @MessageBody() {recipientId, ids}: HandleReadMessages,
    @ConnectedSocket() socket: IExtendedSocket
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient)
      this.server.to(recipient.id).emit("read-messages", {ids, companionId: socket.userId});
  }

  getSocketByUserId(id: string): IExtendedSocket {
    const sockets = this.server.sockets.sockets as Map<string, IExtendedSocket>;

    for (const value of sockets.values()) {
      if (value.userId === id) return value;
    }
  }
}
