import {ID} from "@lib/typings";
import {UserPublicData} from "@modules/user";
import {FilePublicData} from "@modules/upload";

export interface GroupChatMemberPublicData extends UserPublicData {
  isOwner: boolean;
  isMember: boolean;
}

export interface AttachmentPublicData {
  id: ID;
  files: FilePublicData[] | null;
  images: string[] | null;
  audio: string | null;
}

export type AttachmentType = "audio" | "image" | "file";

export interface GroupChatPublicData {
  id: ID;
  avatar: string;
  title: string;
}

export type ChatMessageSenderType = "user" | "system";

export type GroupChatMemberRole = "owner" | "member";

export interface GroupChatMessagePublicData {
  id: ID;
  text: string | null;
  sender: GroupChatMemberPublicData | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  replyTo: GroupChatMessagePublicData | null;
  createdAt: Date;
  files: FilePublicData[] | null;
  images: string[] | null;
  audio: string | null;
  chatId: ID;
}

export interface OneToOneChatMessagePublicData {
  id: ID;
  text: string | null;
  sender: OneToOneChatMemberPublicData;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  replyTo: OneToOneChatMessagePublicData | null;
  createdAt: Date;
  files: FilePublicData[] | null;
  images: string[] | null;
  audio: string | null;
  chatId: ID;
}

export interface OneToOneChatMemberPublicData extends UserPublicData {
  isBanned: boolean;
}
