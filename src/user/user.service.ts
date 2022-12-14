import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { log } from 'console'
import { Model } from 'mongoose'
import { Course, CourseDocument } from 'src/course/course.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { Role } from './roles.enum'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create({
      ...dto,
      roles: Role.User,
    })
    return await user.save()
  }
  async updateToken(id: string, refreshToken: string) {
    const user = await this.userModel.findById(id)
    if (user) return user.updateOne({ refreshToken })
  }
  async startCourse(userId: string, courseId: string) {
    const user = await this.userModel.findById(userId)
    const course = await this.courseModel.findById(courseId)
    if (!user.inProgressCourses.includes(course.id)) {
      user.inProgressCourses.push(course)
      user.save()
    }
  }
  async getInProgressCourses(userId: string) {
    const user = await this.userModel.findById(userId)
    return user.inProgressCourses
  }
  async getCreatedCourses(userId: string) {
    const user = await this.userModel.findById(userId)
    return user.createdCourse
  }

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).populate('subscribedCourse', { weeks: 0 })
  }
  async findByMail(mail: string) {
    return await this.userModel.findOne({ mail })
  }
  async addCreatedCourse(id: string, course: Course) {
    const user = await this.userModel.findById(id).exec()
    return user.createdCourse.push(course)
  }
}
