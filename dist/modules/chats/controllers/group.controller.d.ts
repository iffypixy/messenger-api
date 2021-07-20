import { FilePublicData } from "@modules/uploads";
import { User } from "@modules/users";
import { ID } from "@lib/typings";
import { GroupService, GroupMemberService, GroupMessageService } from "../services";
import { GroupMemberPublicData, GroupMessagePublicData, GroupPublicData } from "../entities";
import { GetMessagesDto } from "../dtos/group";
export declare class GroupController {
    private readonly memberService;
    private readonly messageService;
    private readonly chatService;
    constructor(memberService: GroupMemberService, messageService: GroupMessageService, chatService: GroupService);
    getChats(user: User): Promise<{
        chats: {
            details: GroupPublicData;
            member: GroupMemberPublicData;
            lastMessage: GroupMessagePublicData;
            unreads: number;
        }[];
    }>;
    getMessages(user: User, id: ID, dto: GetMessagesDto): Promise<{
        messages: GroupMessagePublicData[];
    }>;
    getChat(user: User, id: ID): Promise<{
        chat: {
            details: GroupPublicData;
            member: GroupMemberPublicData;
            participants: number;
        };
    }>;
    getAttachedImages(user: User, id: ID): Promise<{
        images: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    getAttachedAudios(user: User, id: ID): Promise<{
        audios: {
            id: ID;
            url: string;
            createdAt: Date;
        }[];
    }>;
    getAttachedFiles(user: User, id: ID): Promise<{
        files: {
            id: ID;
            file: FilePublicData;
            createdAt: Date;
        }[];
    }>;
}
