import {BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {CookieOptions, Request, Response} from "express";
import * as bcrypt from "bcryptjs";

import {UserService, IUserPublicData, User} from "@features/user";
import {RefreshSessionService, AuthService} from "./services";
import {LoginDto, RegisterDto} from "./dto";
import {AuthGuard} from "./guard";
import {GetUser} from "@features/auth/decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
  }

  @Post("register")
  @HttpCode(201)
  async register(
    @Body() {email, firstName, lastName, password, fingerprint}: RegisterDto,
    @Res({passthrough: true}) res: Response
  ): Promise<{user: IUserPublicData}> {
    const user = await this.userService.create({email, firstName, lastName, password});

    const {accessToken, refreshToken} = await this.authService.getJWTs(user, fingerprint);

    res.cookie("access-token", accessToken, this.getAccessTokenOptions());
    res.cookie("refresh-token", refreshToken, this.getRefreshTokenOptions());

    return {
      user: user.getPublicData()
    };
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() {email, password, fingerprint}: LoginDto,
    @Res({passthrough: true}) res: Response
  ): Promise<{user: IUserPublicData}> {
    const error = new BadRequestException("Invalid credentials");

    const user = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException(error);

    const isPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordsMatch) throw new BadRequestException(error);

    const {accessToken, refreshToken} = await this.authService.getJWTs(user, fingerprint);

    res.cookie("access-token", accessToken, this.getAccessTokenOptions());
    res.cookie("refresh-token", refreshToken, this.getRefreshTokenOptions());

    return {
      user: user.getPublicData()
    };
  }

  @Post("refresh-tokens")
  @HttpCode(201)
  async refreshTokens(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
    @Body("fingerprint") fingerprint: string,
  ): Promise<void> {
    const error = new BadRequestException("Invalid refresh token");

    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken) throw error;

    const refreshSession = await this.refreshSessionService
      .findOne({fingerprint, token: refreshToken});

    if (!refreshSession) throw error;

    const isExpired = Date.now() - Number(refreshSession.expiresIn) > 0;

    if (isExpired) throw error;

    const {accessToken, refreshToken: newRefreshToken} = await this.authService.getJWTs(refreshSession.user, fingerprint);

    res.cookie("access-token", accessToken, this.getAccessTokenOptions());
    res.cookie("refresh-token", newRefreshToken, this.getRefreshTokenOptions());
  }

  @Post("logout")
  @HttpCode(205)
  async logout(
    @Req() req: Request
  ): Promise<void> {
    const refreshToken = req.cookies["refresh-token"];

    await this.refreshSessionService.delete({token: refreshToken});
  }

  @Get("credentials")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  getCredentials(
    @GetUser() user: User
  ): {credentials: IUserPublicData} {
    return {
      credentials: user.getPublicData()
    };
  }

  private getAccessTokenOptions(): CookieOptions {
    return {
      maxAge: this.configService.get("jwt.accessToken.expiresIn"),
      path: "/",
      httpOnly: true
    };
  }

  private getRefreshTokenOptions(): CookieOptions {
    return {
      maxAge: this.configService.get("jwt.refreshToken.expiresIn"),
      path: "/api/auth",
      httpOnly: true
    };
  }
}