import {Controller, Get, NotFoundException, Param, Query} from "@nestjs/common";
import {ILike} from "typeorm";

import {ID} from "@lib/typings";
import {UsersService} from "./users.service";
import {GetUsersByLoginQueryDto} from "./dtos";
import {UserPublicData} from "./entities";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get("search")
  async getByLoginQuery(
    @Query() {query}: GetUsersByLoginQueryDto
  ): Promise<{users: UserPublicData[]}> {
    const users = await this.usersService.find({
      where: {
        username: ILike(query)
      }
    });

    return {
      users: users.map((user) => user.public)
    };
  }

  @Get(":id")
  async getById(@Param("id") id: ID): Promise<{user: UserPublicData}> {
    const user = await this.usersService.findById(id);

    if (!user) throw new NotFoundException("User is not found");

    return {
      user: user.public
    };
  }
}
