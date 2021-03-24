import {IsString} from "class-validator";

export class LoginDto {
  @IsString({
    message: "Login must be a string"
  })
  login: string;

  @IsString({
    message: "Password must be a string"
  })
  password: string;

  @IsString({
    message: "Fingerprint must be a string"
  })
  fingerprint: string;
}