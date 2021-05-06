import {IsString, MinLength} from "class-validator";

export class GetUsersByLoginQueryDto {
  @IsString({message: "Query must be type of string"})
  @MinLength(1, {message: "Query must have at least 1 character"})
  query: string;
}