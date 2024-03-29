import { FilePublicData } from "@modules/uploads";
import { User } from "@modules/users";
import { ID } from "@lib/typings";
import { GroupsService, GroupMembersService, GroupMessagesService } from "../services";
import { GroupMemberPublicData, GroupMessagePublicData, GroupPublicData } from "../entities";
import { GetMessagesDto } from "../dtos/groups";
export declare class GroupsController {
    private readonly membersService;
    private readonly messagesService;
    private readonly chatsService;
    constructor(membersService: GroupMembersService, messagesService: GroupMessagesService, chatsService: GroupsService);
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
