import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { log } from "console";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { Role } from "./roles.enum";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create({
      ...dto,
      roles: Role.User,
      createdDate: Date.now(),
    });
    return await user.save();
  }
  async updateToken(id: string, refreshToken) {
    const user = await this.userModel.findById(id);
    if (user) return user.updateOne({ refreshToken });
  }
  async findById(id: string) {
    // log(await this.userModel.findById(id));
    return await this.userModel.findById(id);
  }
  async findByMail(mail: string) {
    return await this.userModel.findOne({ mail });
  }
}
