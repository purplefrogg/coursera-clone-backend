import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { compare } from "bcrypt";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "rtStrategy") {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies.refresh;
      },
      ignoreExpiration: "30d",
      secretOrKey: "rt_secret",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userService.findById(payload.sub);
    log(user);

    if (!user || !user.refreshToken) return null;
    log("sedjsfosdijf oidsjf oidsjf");
    const isValid = await compare(user.refreshToken, req.cookies.refresh);
    log("asdfsadfaasdf", isValid);
    if (isValid) return null;

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: "15m", secret: "at_secret" }
    );
    return accessToken;
  }
}
