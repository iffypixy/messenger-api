export declare const jwtConfig: (() => {
    secret: string;
    accessToken: {
        expiresIn: number;
    };
    refreshToken: {
        expiresIn: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost;
