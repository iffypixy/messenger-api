import {IsString} from "class-validator";

export class RefreshTokensDto {
  @IsString({
    message: "Fingerprint must be type of string"
  })
  fingerprint: string;
}