import {IsString, MaxLength} from "class-validator";

import {UserDto} from "@features/user";

export class RegisterDto extends UserDto {
  @IsString({
    message: "Fingerprint type must be string"
  })
  @MaxLength(256, {
    message: "Fingerprint length must be at maximum 512 chars"
  })
  fingerprint: string;
}