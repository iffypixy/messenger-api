import { User } from "@modules/users";
import { FilePublicData } from "@modules/uploads";
import { ID } from "@lib/typings";
import { DirectMembersService, DirectMessagesService, DirectsService } from "../services";
import { DirectPublicData, DirectMemberPublicData, DirectMessagePublicData } from "../entities";
import { GetMessagesDto, GetAttachmentsDto } from "../dtos/directs";
export declare class DirectsController {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    constructor(memberService: DirectMembersService, messageService: DirectMessagesService, chatService: DirectsService);
    getChats(user: User): Promise<{
        chats: {
            details: DirectPublicData;
            partner: DirectMemberPublicData;
            lastMessage: DirectMessagePublicData;
            isBanned: boolean;
            unread: number;
        }[];
    }>;
    getMessages(user: User, partnerId: ID, dto: GetMessagesDto): Promise<{
        messages: DirectMessagePublicData[];
    }>;
    getChat(user: User, partnerId: ID): Promise<{
        chat: {
            details: DirectPublicData;
            partner: DirectMemberPublicData;
            isBanned: boolean;
        };
    }>;
    getAttachedImages(user: User, partnerId: ID, dto: GetAttachmentsDto): Promise<{
        images: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    getAttachedAudios(user: User, partnerId: ID, dto: GetAttachmentsDto): Promise<{
        audios: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    getAttachedFiles(user: User, partnerId: ID, dto: GetAttachmentsDto): Promise<{
        files: {
            id: ID;
            file: FilePublicData;
            createdAt: Date;
        }[];
    }>;
}
