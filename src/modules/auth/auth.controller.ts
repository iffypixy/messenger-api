import {BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Response, Request} from "express";
import * as jdenticon from "jdenticon";
import {v4} from "uuid";
import * as bcrypt from "bcryptjs";

import {UploadsService} from "@modules/uploads";
import {User, UsersService, UserPublicData} from "@modules/users";
import {GetUser} from "./decorators";
import {IsAuthorizedGuard} from "./guards";
import {LoginDto, RegisterDto, RefreshTokensDto} from "./dtos";
import {AuthService, RefreshSessionsService} from "./services";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshSessionService: RefreshSessionsService,
    private readonly authService: AuthService,
    private readonly uploadService: UploadsService
  ) {
  }

  @HttpCode(201)
  @Post("register")
  async register(
    @Body() {username, password, fingerprint}: RegisterDto,
    @Res({passthrough: true}) res: Response
  ): Promise<{credentials: UserPublicData}> {
    const existed = await this.userService.findOne({
      where: {username}
    });

    if (existed) throw new BadRequestException("This login has been already used");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const png = jdenticon.toPng(v4(), 300);

    const avatar = (await this.uploadService.upload(png, "image/png")).Location;

    const user = await this.userService.create({
      username, avatar,
      password: hashedPassword,
      role: "user", lastSeen: new Date()
    });

    const {accessToken, refreshToken} = await this.authService.getJWTs(user, fingerprint);

    res.cookie("access-token", accessToken, this.authService.accessTokenCookieOptions);
    res.cookie("refresh-token", refreshToken, this.authService.refreshTokenCookieOptions);

    return {
      credentials: user.public
    };
  }

  @Post("login")
  async login(
    @Body() {username, password, fingerprint}: LoginDto,
    @Res({passthrough: true}) res: Response
  ): Promise<{credentials: UserPublicData}> {
    const user = await this.userService.findOne({
      where: {username}
    });

    const error = new BadRequestException("Invalid credentials");

    if (!user) throw error;

    const doPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!doPasswordsMatch) throw error;

    await this.refreshSessionService.delete({fingerprint});

    const {accessToken, refreshToken} = await this.authService.getJWTs(user, fingerprint);

    res.cookie("access-token", accessToken, this.authService.accessTokenCookieOptions);
    res.cookie("refresh-token", refreshToken, this.authService.refreshTokenCookieOptions);

    return {
      credentials: user.public
    };
  }

  @HttpCode(204)
  @Post("refresh-tokens")
  async refreshTokens(
    @Body() {fingerprint}: RefreshTokensDto,
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ): Promise<void> {
    const token: string = req.cookies["refresh-token"];

    const error = new BadRequestException("Invalid refresh token");

    if (!token) throw error;

    const session = await this.refreshSessionService.findOne({
      where: {fingerprint, token}
    });

    if (!session) throw error;

    const isExpired = Date.now() - Number(session.expiresAt) >= 0;

    if (isExpired) throw error;

    await this.refreshSessionService.delete({
      id: session.id
    });

    const {accessToken, refreshToken: newRefreshToken} = await this.authService.getJWTs(session.user, fingerprint);

    res.cookie("access-token", accessToken, this.authService.accessTokenCookieOptions);
    res.cookie("refresh-token", newRefreshToken, this.authService.refreshTokenCookieOptions);
  }

  @UseGuards(IsAuthorizedGuard)
  @Get("credentials")
  getCredentials(
    @GetUser() user: User
  ): {credentials: UserPublicData} {
    return {
      credentials: user.public
    };
  }

  @UseGuards(IsAuthorizedGuard)
  @HttpCode(204)
  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token: string = req.cookies["refresh-token"];

    res.cookie("access-token", null);
    res.cookie("refresh-token", null);

    await this.refreshSessionService.delete({token});
  }
}
