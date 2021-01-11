import {Request} from "express";
import {Socket} from "socket.io";

import {User} from "@features/user";

export type ID = string;

export interface ExtendedRequest extends Request {
  user: User;
}

export interface ExtendedSocket extends Socket {
  userId: ID;
}

export interface Attachments {
  images: ID[];
  files: ID[];
}

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

