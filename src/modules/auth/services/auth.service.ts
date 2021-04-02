import {Injectable, forwardRef, Inject} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

import {User, UserService} from "@modules/user";
import {WebsocketsService} from "@modules/websockets";
import {idleTime} from "@lib/constants";
import {events} from "../lib/constants";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => WebsocketsService))
    private readonly websocketsService: WebsocketsService
  ) {}

  async findUserByToken(token: string): Promise<User | null> {
    try {
      const {userId} = await this.jwtService.verifyAsync(token);

      const user = (await this.userService.findById(userId)) || null;

      if (user) {
        const lastSeen = new Date();

        await this.userService.update({id: user.id}, {lastSeen});
        const sockets = this.websocketsService.getSocketsByUserId(user.id);

        sockets.forEach(socket => {
          socket.user = user;

          socket.emit(events.USER_ONLINE, {id: user.id});

          clearTimeout(socket.idleTimeout);

          socket.idleTimeout = setTimeout(() => {
            socket.emit(events.USER_OFFLINE, {id: user.id});
          }, idleTime);
        });
      }

      return user;
    } catch (error) {
      return null;
    }
  }
}
