import {IsArray, IsString, ValidateNested} from "class-validator";

class Attachments {
  @IsString({message: "Audio id type must be number"})
  audioId: string;

  @IsArray({
      each: true,
      message: "Image id type must be string"
  })
  imagesIds: string[];

  @IsArray({
    each: true,
    message: "File id type must be number"
  })
  filesIds: string[];
}

export class CreateMessageDto {
  @IsString({message: "Text type must be string"})
  text: string;

  @ValidateNested()
  attachments: Attachments;
}