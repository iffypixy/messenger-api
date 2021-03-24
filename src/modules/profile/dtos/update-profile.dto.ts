import {IsString, IsOptional, IsAlpha, Length} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString({message: "Login must have type of string"})
  @IsAlpha("en-US", {message: "Login must have only letters"})
  @Length(3, 25, {
    message: "Login length must be from 3 to 25"
  })
  login?: string;
}