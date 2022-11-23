import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { RtStrategy } from "./strategy/rt.strategy";
import { AtStrategy } from "./strategy/at.strategy";

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [AuthService, RtStrategy, AtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
