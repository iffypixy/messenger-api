import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, Repository} from "typeorm";

import {File} from "../entity";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  create(options: DeepPartial<File>): Promise<File> {
    const file = this.fileRepository.create(options);

    return this.fileRepository.save(file);
  }
}