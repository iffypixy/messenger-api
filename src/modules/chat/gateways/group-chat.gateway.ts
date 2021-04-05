import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {In} from "typeorm";

import {ExtendedSocket, ID} from "@lib/typings";
import {WebsocketsService} from "@modules/websockets";
import {GroupChatMemberService} from "../services";
import {events} from "../lib/group-chat-events";

interface JoiningEventBody {
  chatsIds: ID[];
}

@WebSocketGateway()
export class GroupChatGateway {
  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly memberService: GroupChatMemberService
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
