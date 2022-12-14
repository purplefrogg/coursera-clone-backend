import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { log } from 'console'
import mongoose, { Model } from 'mongoose'
import { User, UserDocument } from 'src/user/user.schema'
import { UserService } from 'src/user/user.service'
import { Course, CourseDocument } from './course.schema'
import { CreateCourseDto } from './dto/create-course.dto'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { CreateWeekDto, Week } from './dto/create-week.dto'

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findAll() {
    return await this.courseModel
      .find()
      .select({
        name: 1,
        creatorName: 1,
        imageUrl: 1,
        createdDate: 1,
        weeks: 1,
        subscribers: 1,
      })
      .exec()
  }

  async findById(id: string) {
    return await this.courseModel.findById(id)
  }
  async create(dto: CreateCourseDto, userId: string, imageUrl: string) {
    const user = await this.userModel.findById(userId)

    const course = await this.courseModel.create({
      ...dto,
      imageUrl,
      creatorName: user.name,
      creatorId: user.id,
      createdDate: Date.now(),
    })

    user.createdCourse.push(course)
    user.save()
    return course.save()
  }

  async addWeek(dto: Week, courseId: string, userId: string) {
    const user = await this.userModel.findById(userId)
    const course = await this.courseModel.findById(courseId)

    if (!user.createdCourse.includes(course.id)) {
      throw new BadRequestException('You are not creator of this course')
    }
    course.weeks.push(dto)

    return await course.save()
  }

  async addLesson(dto: CreateLessonDto, videoUrl: string, userId: string) {
    const user = await this.userModel.findById(userId)
    const course = await this.courseModel.findById(dto.courseId)
    const week = course.weeks.find(week => week.id === dto.weekId)
    if (!user.createdCourse.includes(course.id)) {
      throw new BadRequestException('You are not creator of this course')
    }
    const { courseId, weekId, ...lesson } = dto
    week.lessons.push({ ...lesson, videoUrl })
    return await course.save()
  }

  async subscribe(courseId: string, userId: string) {
    const user = await this.userModel.findById(userId)
    const course = await this.courseModel.findById(courseId)

    if (user.subscribedCourse.includes(course.id)) {
      throw new BadRequestException('You are already subscribed to this course')
    }
    user.subscribedCourse.push(course)
    course.subscribers++
    await course.save()
    return await user.save()
  }
  async unsubscribe(courseId: string, userId: string) {
    const user = await this.userModel.findById(userId)
    const course = await this.courseModel.findById(courseId)

    if (!user.subscribedCourse.includes(course.id)) {
      throw new BadRequestException('You are not subscribed to this course')
    }

    await user.updateOne({ $pull: { subscribedCourse: course.id } })
    course.subscribers--
    await course.save()
    return await user.save()
  }
}
