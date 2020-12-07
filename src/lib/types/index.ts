import {Request} from "express";

import {User} from "@features/user";

export interface IExtendedRequest extends Request {
  user: User;
}