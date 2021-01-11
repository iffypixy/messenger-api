import {IsString, MaxLength, MinLength, IsOptional, IsAlpha} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString({message: "First name type must be string"})
  @IsAlpha("en-US", {message: "First name must have only letters"})
  @MinLength(1, {message: "First name length must be at least 1 char"})
  @MaxLength(256, {message: "First name length must be at maximum 256 chars"})
  firstName?: string;

  @IsOptional()
  @IsString({message: "Last name type must be string"})
  @IsAlpha("en-US", {message: "Last name must have only letters"})
  @MinLength(1, {message: "Last name length must be at least 1 char"})
  @MaxLength(256, {message: "Last name length must be at maximum 256 chars"})
  lastName?: string;
}