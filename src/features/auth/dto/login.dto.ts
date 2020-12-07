import {IsEmail, IsString} from "class-validator";

export class LoginDto {
  @IsEmail({}, {message: "Email is not valid"})
  email: string;

  @IsString({message: "Password type must be string"})
  password: string;

  @IsString({
    message: "Fingerprint type must be string"
  })
  fingerprint: string;
}