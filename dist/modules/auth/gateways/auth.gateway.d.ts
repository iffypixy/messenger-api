import { OnGatewayInit } from "@nestjs/websockets";
import { Server } from "socket.io";
import { RefreshSessionService } from "../services";
export declare class AuthGateway implements OnGatewayInit {
    private readonly refreshSessionService;
    constructor(refreshSessionService: RefreshSessionService);
    wss: Server;
    afterInit(): void;
}
