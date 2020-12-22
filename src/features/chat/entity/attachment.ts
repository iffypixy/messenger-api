import {Column} from "typeorm";

export class Attachment {
    @Column("varchar", {
        nullable: true
    })
    audio: string;

    @Column("varchar", {
        array: true,
        nullable: true,
    })
    images: string[]; 

    files: File[];
}

export interface File {
    name: string;
    ext: string;
    size: string;
    url: string;
}

export interface AttachmentPublicData {
    audio: string;
    images: string[];
}