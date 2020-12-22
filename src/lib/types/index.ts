import {Request} from "express";

import {User} from "@features/user";

export interface IExtendedRequest extends Request {
  user: User;
}

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}