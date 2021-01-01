import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindConditions, Repository, In} from "typeorm";

import {File} from "../entity";
import {User} from "@features/user";

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
  
  find(conditions: FindConditions<File>): Promise<File[]> {
    return this.fileRepository.find(conditions);
  }

  findOne(conditions: FindConditions<File>): Promise<File> {
    return this.fileRepository.findOne(conditions);
  }
}
