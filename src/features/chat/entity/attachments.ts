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
    const audioPublicData = this.audio?.url;
    const imagesPublicData =
      this.images && this.images.map(({url}) => url);
    const filesPublicData =
      this.files && this.files.map(file => file.getPublicData());

    return {
      audio: audioPublicData,
      images: imagesPublicData,
      files: filesPublicData
    };
  }
}

export interface AttachmentsPublicData {
  audio: string;
  images: string[];
  files: FilePublicData[];
}
