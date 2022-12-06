import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { log } from 'console'
import mongoose, { Model } from 'mongoose'
import { User, UserDocument } from 'src/user/user.schema'
import { UserService } from 'src/user/user.service'
import { Course, CourseDocument } from './course.schema'
import { CreateCourseDto } from './dto/create-course.dto'
import { CreateWeekDto, Week } from './dto/create-week.dto'

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findAll() {
    return await this.courseModel.find().select({ name: 1, creatorName: 1 })
  }

  async create(dto: CreateCourseDto, userId: string, imageUrl: string) {
    const user = await this.userModel.findById(userId)

    const course = await this.courseModel.create({
      ...dto,
      imageUrl,
      creatorName: user.name,
      createdDate: Date.now(),
    })

    user.createdCourse.push(course)
    user.save()
    return course.save()
  }

  async addWeek(dto: Week, courseId: string) {
    if (!mongoose.isValidObjectId(courseId)) throw new BadRequestException()

    const course = await this.courseModel.findOne({ id: courseId }).exec()

    log('addWeek', dto, courseId)

    course.weeks.push(dto)
    return await course.save()
  }
}
