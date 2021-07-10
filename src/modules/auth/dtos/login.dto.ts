import {IsString, Length} from "class-validator";

export class LoginDto {
  @IsString({
    message: "Username must be type of string"
  })
  username: string;

  @IsString({
    message: "Password must be type of string"
  })
  password: string;

  @IsString({
    message: "Fingerprint must be type of string"
  })
  fingerprint: string;
}