import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UserService} from "./user.service";
import {User} from "./entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User]
    )
  ],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}