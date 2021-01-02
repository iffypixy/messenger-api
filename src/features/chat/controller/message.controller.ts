import {Body, Controller, Delete, Put} from "@nestjs/common";
import {Not} from "typeorm";

import {GetUser} from "@features/auth";
import {User} from "@features/user";
import {MessageService} from "../service";

@Controller("messages")
export class MessageController {
    constructor(
        private readonly messageService: MessageService
    ) {}

    @Put("read")
    async readMessages(
        @GetUser() user: User,
        @Body("ids") ids: string[]
    ): Promise<void> {
        for (let i = 0; i < ids.length; i++) {
            await this.messageService.update({id: ids[i], sender: {id: Not(user.id)}}, {isRead: true});
        }
    }

    @Delete("delete")
    async deleteMessages(
      @GetUser() user: User,
      @Body("ids") ids: string[]
    ): Promise<void> {
        for (let i = 0; i < ids.length; i++) {
            await this.messageService.delete({id: ids[i], sender: user});
        }
    }
}