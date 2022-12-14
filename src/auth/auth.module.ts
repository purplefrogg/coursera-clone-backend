import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { RtStrategy } from "./strategy/rt.strategy";
import { AtStrategy } from "./strategy/at.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/user.schema";

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, RtStrategy, AtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
