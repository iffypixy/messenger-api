import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, FindOneOptions, Repository} from "typeorm";

import {File} from "../entities";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly repository: Repository<File>
  ) {}

  create(partial: DeepPartial<File>): Promise<File> {
    const file = this.repository.create(partial);

    return this.repository.save(file);
  }

  find(options: FindManyOptions<File>): Promise<File[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<File>): Promise<File> {
    return this.repository.findOne(options);
  }
}
