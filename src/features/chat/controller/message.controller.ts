import {Body, Controller, Put} from "@nestjs/common";

import {MessageService} from "../service";

@Controller("messages")
export class MessageController {
    constructor(
        private readonly messageService: MessageService
    ) {}

    @Put("read")
    async readMessages(
        @Body("messagesIds") ids: string[] 
    ): Promise<void> {
        for (let i = 0; i < ids.length; i++) {
            await this.messageService.update({id: ids[i]}, {isRead: true});
        }
    }
}