import { Server } from "socket.io";
import { FilesService } from "@modules/uploads";
import { UsersService } from "@modules/users";
import { ExtendedSocket } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectMembersService, DirectMessagesService, DirectsService } from "../services";
import { CreateMessageDto, BanPartnerDto, UnbanPartnerDto, ReadMessageDto } from "../dtos/directs";
import { DirectMessagePublicData } from "../entities";
export declare class DirectsGateway {
    private readonly membersService;
    private readonly messagesService;
    private readonly chatsService;
    private readonly filesService;
    private readonly usersService;
    private readonly websocketsService;
    constructor(membersService: DirectMembersService, messagesService: DirectMessagesService, chatsService: DirectsService, filesService: FilesService, usersService: UsersService, websocketsService: WebsocketService);
    wss: Server;
    handleCreatingMessage(socket: ExtendedSocket, dto: CreateMessageDto): Promise<{
        message: DirectMessagePublicData;
    }>;
    handleBanningPartner(socket: ExtendedSocket, dto: BanPartnerDto): Promise<void>;
    handleUnbanningPartner(socket: ExtendedSocket, dto: UnbanPartnerDto): Promise<void>;
    handleReadingMessage(socket: ExtendedSocket, dto: ReadMessageDto): Promise<void>;
}
