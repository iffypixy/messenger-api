import {IsString, MaxLength, MinLength, IsOptional} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString({message: "First name type must be string"})
  @MinLength(1, {message: "First name length must be at least 1 chars"})
  @MaxLength(256, {message: "First name length must be at maximum 256 chars"})
  firstName?: string;

  @IsOptional()
  @IsString({message: "Last name type must be string"})
  @MinLength(1, {message: "Last name length must be at least  chars"})
  @MaxLength(256, {message: "Last name length must be at maximum 256 chars"})
  lastName?: string;
}
