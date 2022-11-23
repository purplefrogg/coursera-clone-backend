import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { log } from "console";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserDocument } from "src/user/user.schema";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async login(dto: LoginDto) {
    const user = await this.userService.findByMail(dto.mail);

    if (!user) {
      throw new BadRequestException();
    }
    const hashedPassword = await compare(user.password, dto.password);
    if (!hashedPassword) {
      const { accessToken, refreshToken } = await this.getToken(user);

      this.userService.updateToken(user.id, await hash(refreshToken, 5));
      return { accessToken, refreshToken };
    }
    throw new BadRequestException();
  }
  async registration(dto: CreateUserDto) {
    const user = await this.userService.findByMail(dto.mail);
    if (user) {
      throw new BadRequestException();
    }
    const hashedPassword = await hash(dto.password, 5);
    const createUser = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await this.getToken(createUser);
    this.userService.updateToken(createUser.id, await hash(refreshToken, 5));

    log(createUser);
    return { accessToken, refreshToken };
  }
  async logout(id: string) {
    const user = await this.userService.findById(id);
    user.refreshToken = null;
    return user;
  }
  async getToken(user: UserDocument) {
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: "15m",
        secret: "at_secret",
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: "30d",
        secret: "rt_secret",
      }
    );
    return { accessToken, refreshToken };
  }
}
