import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {DeepPartial, Repository} from "typeorm";
import * as bcrypt from "bcryptjs";

import {User} from "./entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }

  async create(options: DeepPartial<User>): Promise<User> {
    const hashSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(options.password, hashSalt);

    const user = this.userRepository.create({...options, password: hashedPassword});

    return this.userRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({email});
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({id}, {cache: true});
  }
}