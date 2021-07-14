import {IsString, IsOptional, Length, IsAlphanumeric} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString({
    message: "Username must have type of string"
  })
  @IsAlphanumeric("en-US", {
    message: "Username must have only letters and numbers"
  })
  @Length(3, 24)
  username?: string;
}