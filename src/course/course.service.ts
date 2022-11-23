import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { log } from "console";
import { Model } from "mongoose";
import { UserService } from "src/user/user.service";
import { Course, CourseDocument } from "./course.schema";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private userService: UserService
  ) { }

  async create(dto: CreateCourseDto, userId: string) {
    const user = await this.userService.findById(userId);
    log(user);
    const course = await this.courseModel.create({
      ...dto,
      creatorName: user.name,
      createdDate: Date.now(),
    });

    user.createdCourse.push(course);
    user.save();
    return course.save();
  }
}
