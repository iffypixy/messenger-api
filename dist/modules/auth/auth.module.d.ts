import { NestModule, MiddlewareConsumer } from "@nestjs/common";
export declare class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
