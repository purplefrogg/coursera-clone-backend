import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { log } from "console";
import { Model } from "mongoose";
import { Course } from "src/course/course.schema";
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
  async updateToken(id: string, refreshToken: string) {
    const user = await this.userModel.findById(id);
    if (user) return user.updateOne({ refreshToken });
  }
  async findById(id: string): Promise<UserDocument> {
    // log(await this.userModel.findById(id));
    return await this.userModel.findById(id).populate("createdCourse");
  }
  async findByMail(mail: string) {
    return await this.userModel.findOne({ mail });
  }
  async addCreatedCourse(id: string, course: Course) {
    const user = await this.userModel.findById(id).exec();
    return user.createdCourse.push(course);
  }
}
