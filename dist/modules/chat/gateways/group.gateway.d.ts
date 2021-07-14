import { Server } from "socket.io";
import { FileService } from "@modules/upload";
import { UserService } from "@modules/user";
import { ExtendedSocket } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectPublicData, GroupMemberPublicData, GroupMessagePublicData, GroupPublicData } from "../entities";
import { GroupMemberService, GroupMessageService, GroupService } from "../services";
import { CreateMessageDto, CreateChatDto, AddMemberDto, KickMemberDto, LeaveChatDto, ReadMessageDto, SubscribeChatsDto } from "../dtos/group";
export declare class GroupGateway {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    private readonly fileService;
    private readonly userService;
    private readonly websocketService;
    constructor(memberService: GroupMemberService, messageService: GroupMessageService, chatService: GroupService, fileService: FileService, userService: UserService, websocketService: WebsocketService);
    wss: Server;
    handleSubscribingChat(socket: ExtendedSocket, dto: SubscribeChatsDto): Promise<void>;
    handleCreatingMessage(socket: ExtendedSocket, dto: CreateMessageDto): Promise<{
        message: DirectPublicData;
    }>;
    handleCreatingChat(socket: ExtendedSocket, dto: CreateChatDto): Promise<{
        chat: {
            member: GroupMemberPublicData;
            numberOfMembers: number;
        } & GroupPublicData;
    }>;
    handleAddingMember(socket: ExtendedSocket, dto: AddMemberDto): Promise<{
        chat: {
            member: GroupMemberPublicData;
            numberOfMembers: number;
        } & GroupPublicData;
    }>;
    handleRemovingMember(socket: ExtendedSocket, dto: KickMemberDto): Promise<{
        chat: {
            member: GroupMemberPublicData;
            numberOfMembers: number;
        } & GroupPublicData;
    }>;
    handleLeavingChat(socket: ExtendedSocket, dto: LeaveChatDto): Promise<{
        chat: GroupPublicData;
    }>;
    handleReadingMessage(socket: ExtendedSocket, dto: ReadMessageDto): Promise<{
        message: GroupMessagePublicData;
        chat: GroupPublicData;
    }>;
}
