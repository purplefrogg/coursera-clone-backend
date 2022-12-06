import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { User, UserSchema } from "src/user/user.schema";
import { CourseController } from "./course.controller";
import { Course, CourseSchema } from "./course.schema";
import { CourseService } from "./course.service";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
