import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { File } from "../entities";
export declare class FilesService {
    private readonly repository;
    constructor(repository: Repository<File>);
    create(partial: DeepPartial<File>): Promise<File>;
    find(options: FindManyOptions<File>): Promise<File[]>;
    findOne(options: FindOneOptions<File>): Promise<File>;
}
