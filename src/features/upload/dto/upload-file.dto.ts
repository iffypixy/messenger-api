import {IsIn} from "class-validator";

const ALLOWED_FILE_EXTENSIONS_LIST = ["image/jpg", "image/png", "image/svg", "image/jpeg"];

export class UploadFileDto {
    @IsIn(ALLOWED_FILE_EXTENSIONS_LIST, {
        message: "Extension is not in allowed extensions list"
    })
    extension: string;
}