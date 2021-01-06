import {IsNumberString, IsString, MinLength} from "class-validator";

export class GetSearchedUsers {
  @IsString({message: "Query type must be a string"})
  @MinLength(1, {message: "Query length must be at least 1 character"})
  q: string;

  @IsNumberString(null, {message: "Limit type must be a number"})
  limit: number;
}