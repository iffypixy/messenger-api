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

interface HandleCreateMessageData {
  recipientId: string;
  message: MessagePublicData;
}

interface HandleReadMessagesData {
  recipientId: string;
  ids: string[];
}

interface HandleTypingData {
  recipientId: string;
}

const COMPANION_STATUSES = {
  typing: "typing..."
};

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
    @MessageBody() {recipientId, message}: HandleCreateMessageData
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient) this.server.to(recipient.id).emit("message", {message});
  }

  @SubscribeMessage("read-messages")
  handleReadMessages(
    @MessageBody() {recipientId, ids}: HandleReadMessagesData,
    @ConnectedSocket() socket: IExtendedSocket
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient)
      this.server.to(recipient.id).emit("read-messages", {ids, companionId: socket.userId});
  }

  @SubscribeMessage("typing")
  handleTyping(
    @MessageBody() {recipientId}: HandleTypingData,
    @ConnectedSocket() socket: IExtendedSocket
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient)
      this.server.to(recipient.id).emit("typing", {companionId: socket.userId, status: COMPANION_STATUSES.typing});
  }

  getSocketByUserId(id: string): IExtendedSocket {
    const sockets = this.server.sockets.sockets as Map<string, IExtendedSocket>;

    for (const value of sockets.values()) {
      if (value.userId === id) return value;
    }
  }
}
