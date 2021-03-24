import {ID} from "@lib/typings";
import {UserPublicData} from "@modules/user";
import {FilePublicData} from "@modules/upload";

export interface GroupChatPublicData {
  id: ID;
  avatar: string;
  title: string;
}

export interface ChatMessagePublicData {
  id: ID;
  text: string | null;
  sender: UserPublicData | null;
  files: FilePublicData[] | null;
  images: string[] | null;
  audio: string | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  createdAt: string;
}
