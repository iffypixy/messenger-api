import { Server } from "socket.io";
import { FileService } from "@modules/upload";
import { UserService } from "@modules/user";
import { ExtendedSocket } from "@lib/typings";
import { WebsocketService } from "@lib/websocket";
import { DirectMemberService, DirectMessageService, DirectService } from "../services";
import { CreateMessageDto, BanPartnerDto, UnbanPartnerDto, ReadMessageDto } from "../dtos/direct";
import { DirectMemberPublicData, DirectMessagePublicData, DirectPublicData } from "../entities";
export declare class DirectGateway {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    private readonly fileService;
    private readonly userService;
    private readonly websocketsService;
    constructor(memberService: DirectMemberService, messageService: DirectMessageService, chatService: DirectService, fileService: FileService, userService: UserService, websocketsService: WebsocketService);
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
