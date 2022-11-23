import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { CourseController } from "./course.controller";
import { Course, CourseSchema } from "./course.schema";
import { CourseService } from "./course.service";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
