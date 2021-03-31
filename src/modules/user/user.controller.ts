import {Controller, Get, NotFoundException, Param, Query} from "@nestjs/common";

import {ID} from "@lib/typings";
import {GetUsersByLoginQueryDto} from "./dtos";
import {UserService} from "./user.service";
import {UserPublicData} from "./lib/typings";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("search")
  async getUsersByLoginQuery(
    @Query() {q, limit}: GetUsersByLoginQueryDto
  ): Promise<{users: UserPublicData[]}> {
    const users = await this.userService.findUsersByLoginQuery(q, {limit});

    return {
      users: users.map(user => user.public)
    };
  }

  @Get(":id")
  async getUserById(@Param("id") id: ID): Promise<{user: UserPublicData}> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundException("User not found");

    return {
      user: user.public
    };
  }
}
