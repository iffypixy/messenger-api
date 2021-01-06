import {Body, Controller, Put} from "@nestjs/common";

import {UserService, User} from "@features/user";
import {UpdateProfileDto} from "./dto";
import {GetUser} from "@features/auth";

@Controller("profile")
export class ProfileController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Put("/update")
  async updateProfile(
    @GetUser() user: User,
    @Body() {firstName, lastName}: UpdateProfileDto
  ): Promise<any> {
    await this.userService.update({id: user.id}, {firstName, lastName});

    const updatedUser = await this.userService.findById(user.id);

    return {
      credentials: updatedUser.getPublicData()
    };
  }
}