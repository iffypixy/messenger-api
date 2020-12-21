import {IsArray, IsString, ValidateNested} from "class-validator";

class Attachment {
  @IsString({message: "Audio type must be string"})
  audio?: string;

  @IsArray({
      each: true,
      message: "Image type must be string"
  })
  images: string[];
}

export class CreateMessageDto {
  @IsString({message: "Text type must be string"})
  text: string;

  @ValidateNested()
  attachment: Attachment;
}