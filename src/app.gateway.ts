import {SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket, OnGatewayDisconnect} from "@nestjs/websockets";
import {Server} from "socket.io";

import {ExtendedSocket} from "@lib/types";
import {UserService} from "@features/user";
import {MessagePublicData} from "@features/chat";

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

const USER_STATUSES = {
  typing: "typing..."
};

@WebSocketGateway({origins: "http://localhost:3000"})
export class AppGateway implements OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @WebSocketServer()
  server: Server;

  async handleDisconnect(client: ExtendedSocket): Promise<void> {
    if (client.userId) {
      await this.userService.update({id: client.userId}, {online: false});

      client.broadcast.emit("offline", {userId: client.userId});
    }
  }

  @SubscribeMessage("credentials")
  async handleCredentials(
    @MessageBody() {userId}: HandleCredentialsData,
    @ConnectedSocket() client: ExtendedSocket
  ): Promise<void> {
    await this.userService.update({id: userId}, {online: true});

    client.userId = userId;

    client.broadcast.emit("online", {userId: client.userId});
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
    @ConnectedSocket() socket: ExtendedSocket
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient)
      this.server.to(recipient.id).emit("read-messages", {ids, companionId: socket.userId});
  }

  @SubscribeMessage("typing")
  handleTyping(
    @MessageBody() {recipientId}: HandleTypingData,
    @ConnectedSocket() socket: ExtendedSocket
  ): void {
    const recipient = this.getSocketByUserId(recipientId);

    if (recipient)
      this.server.to(recipient.id).emit("typing", {companionId: socket.userId, status: USER_STATUSES.typing});
  }

  getSocketByUserId(id: string): ExtendedSocket  {
    const sockets = this.server.sockets.sockets as Map<string, ExtendedSocket>;

    for (const socket of sockets.values()) {
      if (socket.userId === id) return socket;
    }
  }
}
