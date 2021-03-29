import {Request} from "express";
import {User} from "@modules/user";
import {Socket} from "socket.io";

export interface ExtendedRequest extends Request {
  user: User;
}

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface RequestOptions {
  limit?: number;
  offset?: number;
}

export type ID = string;

export interface HandshakeAuth {
  token: string;
}

export interface ExtendedSocket extends Socket {
  userId: string;
}
