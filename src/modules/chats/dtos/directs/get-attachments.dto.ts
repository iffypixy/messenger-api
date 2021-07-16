import {IsNumberString} from "class-validator";

export class GetAttachmentsDto {
  @IsNumberString({}, {
    message: "Skip must be type of number"
  })
  skip: number;
}