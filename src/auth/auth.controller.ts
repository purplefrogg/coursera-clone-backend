import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { AtGuard } from "./guard/at.guard";
import { RtGuard } from "./guard/rt.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("login")
  async login(@Res({ passthrough: true }) res, @Body() dto: LoginDto) {
    const { refreshToken, accessToken } = await this.authService.login(dto);
    res.cookie("refresh", refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Post("registration")
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto
  ) {
    const { refreshToken, accessToken } = await this.authService.registration(
      dto
    );
    res.cookie("refresh", refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @UseGuards(RtGuard)
  @Get("refresh")
  async refresh(@Req() req) {
    return req.user;
  }

  @UseGuards(AtGuard)
  @Get("logout")
  async logout(@Req() req) {
    return this.authService.logout(req.user.userId);
    // return this.authService.logout()
  }
}
