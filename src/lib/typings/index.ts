import {Request} from "express";
import {Socket} from "socket.io";

import {User} from "@modules/user";

export interface ExtendedRequest extends Request {
  user: User;
}

export interface ExtendedSocket extends Socket {
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

export interface SocketHandshakeAuth {
  username: string;
  password: string;
}