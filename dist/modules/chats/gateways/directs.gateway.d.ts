import { Server } from "socket.io";
import { FilesService } from "@modules/uploads";
import { UsersService } from "@modules/users";
import { ExtendedSocket } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectMembersService, DirectMessagesService, DirectsService } from "../services";
import { CreateMessageDto, BanPartnerDto, UnbanPartnerDto, ReadMessageDto } from "../dtos/directs";
import { DirectMemberPublicData, DirectMessagePublicData, DirectPublicData } from "../entities";
export declare class DirectsGateway {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    private readonly fileService;
    private readonly userService;
    private readonly websocketsService;
    constructor(memberService: DirectMembersService, messageService: DirectMessagesService, chatService: DirectsService, fileService: FilesService, userService: UsersService, websocketsService: WebsocketService);
    wss: Server;
    handleCreatingMessage(socket: ExtendedSocket, dto: CreateMessageDto): Promise<{
        message: DirectMessagePublicData;
    }>;
    handleBanningPartner(socket: ExtendedSocket, dto: BanPartnerDto): Promise<{
        chat: {
            partner: DirectMemberPublicData;
            isBanned: boolean;
        } & DirectPublicData;
    }>;
    handleUnbanningPartner(socket: ExtendedSocket, dto: UnbanPartnerDto): Promise<{
        chat: {
            partner: DirectMemberPublicData;
            isBanned: boolean;
        } & DirectPublicData;
    }>;
    handleReadingMessage(socket: ExtendedSocket, dto: ReadMessageDto): Promise<{
        chat: DirectPublicData;
        message: DirectMessagePublicData;
    }>;
}
