import { OnGatewayInit } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthService } from "../services";
export declare class AuthGateway implements OnGatewayInit {
    private readonly authService;
    constructor(authService: AuthService);
    wss: Server;
    afterInit(): void;
}
