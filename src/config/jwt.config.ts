import {registerAs} from "@nestjs/config";

export const jwtConfig = registerAs("jwt", () => ({
  secretKey: process.env.JWT_SECRET_KEY,
  accessToken: {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
  },
  refreshToken: {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
  }
}));