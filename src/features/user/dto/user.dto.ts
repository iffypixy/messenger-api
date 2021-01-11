import {IsAlpha, IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class UserDto {
  @IsEmail({}, {message: "Email is not valid"})
  email: string;

  @IsString({message: "First name type must be string"})
  @IsAlpha("en-US", {message: "First name must have only letters"})
  @MinLength(1, {message: "First name length must be at least 1 chars"})
  @MaxLength(256, {message: "First name length must be at maximum 256 chars"})
  firstName: string;

  @IsString({message: "Last name type must be string"})
  @IsAlpha("en-US", {message: "Last name must have only letters"})
  @MinLength(1, {message: "Last name length must be at least  chars"})
  @MaxLength(256, {message: "Last name length must be at maximum 256 chars"})
  lastName: string;

  @IsString({message: "Password type must be string"})
  @MinLength(8, {message: "Password length must be at least 8 chars"})
  @MaxLength(256, {message: "Password length must be at maximum 256 chars"})
  password: string;
}