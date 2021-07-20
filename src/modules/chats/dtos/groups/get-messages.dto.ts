import {IsNumberString} from "class-validator";

export class GetMessagesDto {
  @IsNumberString({}, {
    message: "Skip must be type of number"
  })
  skip: number;
}