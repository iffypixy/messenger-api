import {
  ManyToMany,
  ManyToOne,
  JoinTable,
  Entity,
  PrimaryGeneratedColumn,
  Column
} from "typeorm";

import {File} from "@modules/upload";
import {ID} from "@lib/typings";
import {AttachmentType, attachmentTypes} from "../lib/attachment-types";
import {AttachmentPublicData} from "../lib/typings";

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(type => File, {
    nullable: true,
    eager: true
  })
  audio: File;

  @JoinTable()
  @ManyToMany(type => File, {
    nullable: true,
    eager: true
  })
  images: File[];

  @JoinTable()
  @ManyToMany(type => File, {
    nullable: true,
    eager: true
  })
  files: File[];

  @Column("enum", {
    enum: attachmentTypes,
    array: true,
    nullable: true
  })
  includes: AttachmentType[];

  get public(): AttachmentPublicData {
    const files =
      (!!this.files.length && this.files.map(file => file.public)) || null;

    const images =
      (!!this.images.length && this.images.map(({url}) => url)) || null;

    const audio = this.audio && this.audio.url;

    return {
      id: this.id,
      files,
      images,
      audio
    };
  }
}
