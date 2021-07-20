"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const config_1 = require("@nestjs/config");
exports.jwtConfig = config_1.registerAs("jwt", () => ({
    secret: process.env.JWT_SECRET_KEY,
    accessToken: {
        expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, 10)
    },
    refreshToken: {
        expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    }
}));
//# sourceMappingURL=jwt.config.js.map