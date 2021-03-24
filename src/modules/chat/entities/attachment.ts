import {ManyToMany, ManyToOne, JoinTable} from "typeorm";

import {File} from "@modules/upload";

export class Attachment {
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
}
