import {IsAlphanumeric, IsString, Length} from "class-validator";

export class RegisterDto {
  @IsAlphanumeric("en-US", {
    message: "Username must have only letters and numbers"
  })
  @Length(3, 24)
  username: string;

  @IsString({message: "Password must be type of string"})
  @Length(8, 50)
  password: string;

  @IsString({message: "Fingerprint must be type of string"})
  @Length(5, 150)
  fingerprint: string;
}
