import { Server } from "socket.io";
import { FilePublicData, FileService } from "@modules/upload";
import { UserService } from "@modules/user";
import { ExtendedSocket, ID } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectChatPublicData, GroupChatMemberPublicData, GroupChatMessagePublicData, GroupChatPublicData } from "../lib/typings";
import { GroupChatMemberService, GroupChatMessageService, GroupChatService } from "../services";
import { GetGroupChatMessagesDto, CreateGroupChatMessageDto, GetGroupChatDto, GetGroupChatAttachmentsDto, CreateGroupChatDto, AddGroupChatMemberDto, RemoveGroupChatMemberDto, LeaveGroupChatDto, ReadGroupMessageDto, SubscribeGroupChatsDto } from "./dtos";
export declare class GroupChatGateway {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    private readonly fileService;
    private readonly userService;
    private readonly websocketService;
    constructor(memberService: GroupChatMemberService, messageService: GroupChatMessageService, chatService: GroupChatService, fileService: FileService, userService: UserService, websocketService: WebsocketService);
    wss: Server;
    handleSubscribingChat(socket: ExtendedSocket, dto: SubscribeGroupChatsDto): Promise<void>;
    handleGettingChats(socket: ExtendedSocket): Promise<{
        chats: ({
            lastMessage: GroupChatMessagePublicData;
            numberOfMembers: number;
            numberOfUnreadMessages: number;
        } & GroupChatPublicData)[];
    }>;
    handleGettingMessages(socket: ExtendedSocket, dto: GetGroupChatMessagesDto): Promise<{
        messages: GroupChatMessagePublicData[];
    }>;
    handleCreatingMessage(socket: ExtendedSocket, dto: CreateGroupChatMessageDto): Promise<{
        message: DirectChatPublicData;
    }>;
    handleGettingChat(socket: ExtendedSocket, dto: GetGroupChatDto): Promise<{
        chat: {
            member: GroupChatMemberPublicData;
            numberOfMembers: number;
        } & GroupChatPublicData;
    }>;
    handleGettingImages(socket: ExtendedSocket, dto: GetGroupChatAttachmentsDto): Promise<{
        images: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    handleGettingAudios(socket: ExtendedSocket, dto: GetGroupChatAttachmentsDto): Promise<{
        audios: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    handleGettingFiles(socket: ExtendedSocket, dto: GetGroupChatAttachmentsDto): Promise<{
        files: {
            id: ID;
            file: FilePublicData;
            createdAt: Date;
        }[];
    }>;
    handleCreatingChat(socket: ExtendedSocket, dto: CreateGroupChatDto): Promise<{
        chat: {
            member: GroupChatMemberPublicData;
            numberOfMembers: number;
        } & GroupChatPublicData;
    }>;
    handleAddingMember(socket: ExtendedSocket, dto: AddGroupChatMemberDto): Promise<{
        chat: {
            member: GroupChatMemberPublicData;
            numberOfMembers: number;
        } & GroupChatPublicData;
    }>;
    handleRemovingMember(socket: ExtendedSocket, dto: RemoveGroupChatMemberDto): Promise<{
        chat: {
            member: GroupChatMemberPublicData;
            numberOfMembers: number;
        } & GroupChatPublicData;
    }>;
    handleLeavingChat(socket: ExtendedSocket, dto: LeaveGroupChatDto): Promise<{
        chat: GroupChatPublicData;
    }>;
    handleReadingMessage(socket: ExtendedSocket, dto: ReadGroupMessageDto): Promise<{
        message: GroupChatMessagePublicData;
        chat: GroupChatPublicData;
    }>;
}
