import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {WebsocketsModule} from "@lib/websockets";
import {UserService} from "./user.service";
import {User} from "./entities";
import {UserController} from "./user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => WebsocketsModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
