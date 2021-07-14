import {IsNumber} from "class-validator";

export class GetMessagesDto {
  @IsNumber({}, {
    message: "Skip must be type of number"
  })
  skip: number;
}