import {User} from "@features/user";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Dialog} from "../entity";

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(Dialog)
    private readonly dialogRepository: Repository<Dialog>
  ) {}

  // @TODO: make correct queries

  async findByMemberId(memberId: number): Promise<Dialog[]> {
    const dialogs = await this.dialogRepository.find({relations: ["members"]});

    return dialogs.filter(dialog =>
      dialog.members.map(({id}) => id).some(id => id === memberId)
    );
  }

  async findOneByMembers(members: User[]): Promise<Dialog> {
    const dialogs = await this.dialogRepository.find({relations: ["members"]});

    return dialogs.find(dialog =>
      dialog.members
        .map(({id}) => id)
        .every(id => members.map(({id}) => id).includes(id))
    );
  }

  async findByMembersOrCreate(members: User[]): Promise<Dialog> {
    const dialog = await this.findOneByMembers(members);

    if (!dialog) {
      const dialog = this.dialogRepository.create({members});

      return this.dialogRepository.save(dialog);
    }

    return dialog;
  }
}
