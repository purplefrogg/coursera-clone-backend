import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AtGuard, ReqUser } from "src/auth/guard/at.guard";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";

@Controller("course")
export class CourseController {
  constructor(private courseService: CourseService) { }

  @Post("create")
  @UseGuards(AtGuard)
  create(@Body() dto: CreateCourseDto, @Req() req: Request & ReqUser) {
    return this.courseService.create(dto, req.user.userId);
  }
}
