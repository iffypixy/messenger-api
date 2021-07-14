import {IsNumber} from "class-validator";

export class GetAttachmentsDto {
  @IsNumber({}, {
    message: "Skip must be type of number"
  })
  skip: number;
}