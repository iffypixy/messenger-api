import {ManyToMany, ManyToOne} from "typeorm";

import {File, FilePublicData} from "@features/upload";

export class Attachments {
  @ManyToOne(type => File, {nullable: true})
  audio: File | number;

  @ManyToMany(type => File, {nullable: true})
  images: File[] | number[];

  @ManyToMany(type => File, {nullable: true})
  files: File[] | number[];

  getPublicData(): AttachmentsPublicData {
    const audioPublicData = this.audio && (this.audio as File).url;
    const imagesPublicData =
      this.images && (this.images as File[]).map(({url}) => url);
    const filesPublicData =
      this.files && (this.files as File[]).map(file => file.getPublicData());

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
