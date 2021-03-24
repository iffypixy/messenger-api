import {IsString} from "class-validator";

export class RefreshTokensDto {
  @IsString({
    message: "Fingerprint must be a string"
  })
  fingerprint: string;
}