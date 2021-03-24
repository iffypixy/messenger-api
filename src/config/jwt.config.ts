import {registerAs} from "@nestjs/config";

export const jwtConfig = registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET_KEY,
  accessToken: {
    expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, 10)
  },
  refreshToken: {
    expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
  }
}));