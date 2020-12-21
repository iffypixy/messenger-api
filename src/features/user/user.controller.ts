import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe
} from "@nestjs/common";

import {UserPublicData} from "./entity";
import {UserService} from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async getUser(
    @Param("id", ParseIntPipe) id: number
  ): Promise<{user: UserPublicData}> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundException("User not found");

    return {
      user: user.getPublicData()
    };
  }
}
