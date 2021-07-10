import { INestApplicationContext } from "@nestjs/common";
import { AbstractWsAdapter, MessageMappingProperties } from "@nestjs/websockets";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { Observable } from "rxjs";
export declare class WebsocketAdapter extends AbstractWsAdapter {
    private readonly app;
    private readonly cors;
    constructor(app: INestApplicationContext, cors: CorsOptions);
    create(port: number, options?: any & {
        namespace?: string;
        server?: any;
    }): any;
    createIOServer(port: number, options?: any): any;
    bindMessageHandlers(client: any, handlers: MessageMappingProperties[], transform: (data: any) => Observable<any>): void;
    mapPayload(payload: any): {
        data: any;
        ack?: () => any;
    };
}
