import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, Repository} from "typeorm";

import {Attachment} from "../entities";

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>
  ) {}

  create(partial: DeepPartial<Attachment>): Promise<Attachment> {
    const attachment = this.attachmentRepository.create(partial);

    return this.attachmentRepository.save(attachment);
  }
}
