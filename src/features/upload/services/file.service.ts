import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindConditions, Repository} from "typeorm";

import {File} from "../entity";

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

  findOne(conditions: FindConditions<File>): Promise<File> {
    return this.fileRepository.findOne(conditions);
  }

  findByIdsAndUserIdAndExtensions(ids: string[], userId: string, extensions?: string[]): Promise<File[]> {
    const queryBuilder = this.fileRepository
      .createQueryBuilder("file")
      .leftJoinAndSelect("file.user", "user")
      .where("file.id IN (:...ids)", {ids})
      .andWhere("user.id = :userId", {userId});
    
    if (extensions) {
      queryBuilder
      .andWhere("file.extension IN (:...extensions)", {extensions})
      .getMany();
    } 

    return queryBuilder.getMany();
  }
}
