import { Server } from "socket.io";
import { FilePublicData, FileService } from "@modules/upload";
import { UserService } from "@modules/user";
import { ExtendedSocket, ID } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectChatMemberPublicData, DirectChatMessagePublicData, DirectChatPublicData } from "../lib/typings";
import { DirectChatMemberService, DirectChatMessageService, DirectChatService } from "../services";
import { GetDirectChatMessagesDto, CreateDirectChatMessageDto, GetDirectChatDto, GetDirectChatAttachmentsDto, BanDirectChatPartnerDto, UnbanDirectChatPartnerDto, ReadDirectMessageDto } from "./dtos";
export declare class DirectChatGateway {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    private readonly fileService;
    private readonly userService;
    private readonly websocketsService;
    constructor(memberService: DirectChatMemberService, messageService: DirectChatMessageService, chatService: DirectChatService, fileService: FileService, userService: UserService, websocketsService: WebsocketService);
    wss: Server;
    handleGettingChats(socket: ExtendedSocket): Promise<{
        chats: ({
            partner: DirectChatMemberPublicData;
            lastMessage: DirectChatMessagePublicData;
            isBanned: boolean;
            numberOfUnreadMessages: number;
        } & DirectChatPublicData)[];
    }>;
    handleGettingMessages(socket: ExtendedSocket, dto: GetDirectChatMessagesDto): Promise<{
        messages: DirectChatMessagePublicData[];
    }>;
    handleCreatingMessage(socket: ExtendedSocket, dto: CreateDirectChatMessageDto): Promise<{
        message: DirectChatMessagePublicData;
    }>;
    handleGettingChat(socket: ExtendedSocket, dto: GetDirectChatDto): Promise<{
        chat: {
            partner: DirectChatMemberPublicData;
            isBanned: boolean;
        } & DirectChatPublicData;
    }>;
    handleGettingImages(socket: ExtendedSocket, dto: GetDirectChatAttachmentsDto): Promise<{
        images: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    handleGettingAudios(socket: ExtendedSocket, dto: GetDirectChatAttachmentsDto): Promise<{
        audios: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    handleGettingFiles(socket: ExtendedSocket, dto: GetDirectChatAttachmentsDto): Promise<{
        files: {
            id: ID;
            file: FilePublicData;
            createdAt: Date;
        }[];
    }>;
    handleBanningPartner(socket: ExtendedSocket, dto: BanDirectChatPartnerDto): Promise<{
        chat: {
            partner: DirectChatMemberPublicData;
            isBanned: boolean;
        } & DirectChatPublicData;
    }>;
    handleUnbanningPartner(socket: ExtendedSocket, dto: UnbanDirectChatPartnerDto): Promise<{
        chat: {
            partner: DirectChatMemberPublicData;
            isBanned: boolean;
        } & DirectChatPublicData;
    }>;
    handleReadingMessage(socket: ExtendedSocket, dto: ReadDirectMessageDto): Promise<{
        chat: DirectChatPublicData;
        message: DirectChatMessagePublicData;
    }>;
}
