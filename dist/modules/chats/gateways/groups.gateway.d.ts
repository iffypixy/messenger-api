import { Server } from "socket.io";
import { FilesService } from "@modules/uploads";
import { UsersService } from "@modules/users";
import { ExtendedSocket } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectPublicData, GroupPublicData } from "../entities";
import { GroupMembersService, GroupMessagesService, GroupsService } from "../services";
import { CreateMessageDto, CreateChatDto, AddMemberDto, KickMemberDto, LeaveChatDto, ReadMessageDto, SubscribeChatsDto } from "../dtos/groups";
export declare class GroupsGateway {
    private readonly membersService;
    private readonly messagesService;
    private readonly chatsService;
    private readonly filesService;
    private readonly usersService;
    private readonly websocketService;
    constructor(membersService: GroupMembersService, messagesService: GroupMessagesService, chatsService: GroupsService, filesService: FilesService, usersService: UsersService, websocketService: WebsocketService);
    wss: Server;
    subscribeChats(socket: ExtendedSocket, dto: SubscribeChatsDto): Promise<void>;
    createMessage(socket: ExtendedSocket, dto: CreateMessageDto): Promise<{
        message: DirectPublicData;
    }>;
    createChat(socket: ExtendedSocket, dto: CreateChatDto): Promise<{
        chat: {
            details: GroupPublicData;
        };
    }>;
    addMember(socket: ExtendedSocket, dto: AddMemberDto): Promise<void>;
    kickMember(socket: ExtendedSocket, dto: KickMemberDto): Promise<void>;
    leaveChat(socket: ExtendedSocket, dto: LeaveChatDto): Promise<void>;
    handleReadingMessage(socket: ExtendedSocket, dto: ReadMessageDto): Promise<void>;
}
