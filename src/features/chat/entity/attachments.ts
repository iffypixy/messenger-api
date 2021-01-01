import {JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";

import {File, FilePublicData} from "@features/upload";

export class Attachments {
  @ManyToOne(type => File, {eager: true})
  @JoinColumn()
  audio: File;

  @ManyToMany(type => File, {eager: true})
  @JoinTable()
  images: File[];

  @ManyToMany(type => File, {eager: true})
  @JoinTable()
  files: File[];

  getPublicData(): AttachmentsPublicData | undefined {
    const audio = this.audio?.url;
    const images = this.images.length && this.images.map(({url}) => url);
    const files = this.files.length && this.files.map(file => file.getPublicData());

    if (audio || images || files) return {audio, images, files};
  }
}

export interface AttachmentsPublicData {
  audio: string | undefined;
  images: string[] | undefined;
  files: FilePublicData[] | undefined;
}
