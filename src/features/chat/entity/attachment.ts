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
}

export interface AttachmentPublicData {
    audio: string;
    images: string[];
}