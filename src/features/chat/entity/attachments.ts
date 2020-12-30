import {JoinTable, ManyToMany, ManyToOne} from "typeorm";

import {File, FilePublicData} from "@features/upload";

export class Attachments {
  @ManyToOne(type => File, {nullable: true, eager: true})
  audio: File;

  @ManyToMany(type => File, {nullable: true, eager: true})
  @JoinTable()
  images: File[];

  @ManyToMany(type => File, {nullable: true, eager: true})
  @JoinTable()
  files: File[];

  getPublicData(): AttachmentsPublicData {
    const audio = this.audio?.url;
    const images = this.images.map(({url}) => url);
    const files = this.files.map(file => file.getPublicData());

    return {
      audio, images, files
    };
  }
}

export interface AttachmentsPublicData {
  audio: string;
  images: string[];
  files: FilePublicData[];
}
