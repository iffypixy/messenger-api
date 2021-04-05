import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer
} from "@nestjs/websockets";
import {Server} from "socket.io";

import {WebsocketsService} from "@modules/websockets";
import {ExtendedSocket, ID} from "@lib/typings";
import {OneToOneChatMemberService} from "../services";
import {events} from "../lib/one-to-one-chat-events";
import {In} from "typeorm";

interface JoiningEventBody {
  chatsIds: ID[];
}

@WebSocketGateway()
export class OneToOneChatGateway {
  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly memberService: OneToOneChatMemberService
  ) {}

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage(events.JOINING)
  async handleJoinEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {chatsIds}: JoiningEventBody
  ): Promise<void> {
    const members = await this.memberService.find({
      where: {user: {id: client.user.id}, chat: {id: In(chatsIds)}}
    });

    const clients = this.websocketsService.getSocketsByUserId(client.user.id);

    clients.forEach(client =>
      client.join(members.map(member => member.chat.id))
    );
  }
}
