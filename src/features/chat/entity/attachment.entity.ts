import {JoinColumn, JoinTable, ManyToMany, ManyToOne} from "typeorm";

import {File, FilePublicData} from "@features/upload";

export class Attachment {
  @ManyToOne(type => File, {nullable: true})
  @JoinColumn()
  audio: File;

  @ManyToMany(type => File, {nullable: true})
  @JoinTable()
  images: File[];

  @ManyToMany(type => File, {nullable: true})
  @JoinTable()
  files: File[];

  getPublicData(): AttachmentPublicData | null {
    const audio = this.audio ? this.audio.url : null;
    const images = !!this.images?.length ? this.images.map(({url}) => url) : null;
    const files = !!this.files?.length ? this.files.map(file => file.getPublicData()) : null;

    if (audio || images || files) return {audio, images, files};

    return null;
  }
}

export interface AttachmentPublicData {
  audio: string | null;
  images: string[] | null;
  files: FilePublicData[] | null;
}
