import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  Repository,
  FindManyOptions
} from "typeorm";

import {ID} from "@lib/typings";
import {File} from "../entities";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>
  ) {}

  create(options: DeepPartial<File>): Promise<File> {
    const file = this.fileRepository.create(options);

    return this.fileRepository.save(file);
  }

  findByIds(ids: ID[], options?: FindManyOptions<File>): Promise<File[]> {
    return this.fileRepository.findByIds(ids, options);
  }

  find(conditions: FindConditions<File>): Promise<File[]> {
    return this.fileRepository.find(conditions);
  }

  findOne(conditions: FindConditions<File>): Promise<File> {
    return this.fileRepository.findOne(conditions);
  }
}
