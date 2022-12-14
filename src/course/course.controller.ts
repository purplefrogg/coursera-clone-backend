import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { log } from 'console'
import { createReadStream } from 'fs'
import mongoose from 'mongoose'
import { join } from 'path'
import { of } from 'rxjs'
import { AtGuard, ReqUser } from 'src/auth/guard/at.guard'
import { CourseService } from './course.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { CreateLessonDto } from './dto/create-lesson.dto'
import { CreateWeekDto } from './dto/create-week.dto'

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/course-preview',
      fileFilter(req, file, callback) {
        if (file.mimetype.match('image')) return callback(null, true)
        return callback(new BadRequestException('File must be image'), false)
      },
    })
  )
  @UseGuards(AtGuard)
  create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateCourseDto, @Req() req: Request & ReqUser) {
    if (!file) {
      throw new BadRequestException('Fil1e must be image')
    }
    const imageUrl = process.env.BASE_URL + '/course/' + file.path
    return this.courseService.create(dto, req.user.userId, imageUrl)
  }

  @Post('addWeek')
  @UseGuards(AtGuard)
  addWeek(@Body() dto: CreateWeekDto, @Req() req: Request & ReqUser) {
    if (!mongoose.isValidObjectId(dto.courseId)) throw new BadRequestException('Invalid course id')
    if (!mongoose.isValidObjectId(req.user.userId)) throw new BadRequestException('Invalid user id')
    return this.courseService.addWeek(dto.week, dto.courseId, req.user.userId)
  }

  @Post('addLesson')
  @UseInterceptors(
    FileInterceptor('video', {
      dest: 'uploads/course-lesson',
      fileFilter(req, file, callback) {
        if (file.mimetype.match('video')) return callback(null, true)
        return callback(new BadRequestException('File must be video'), false)
      },
    })
  )
  @UseGuards(AtGuard)
  addLesson(@UploadedFile() video: Express.Multer.File, @Body() dto: CreateLessonDto, @Req() req: Request & ReqUser) {
    if (!video) {
      throw new BadRequestException('Fil1e must be video')
    }
    if (!mongoose.isValidObjectId(dto.courseId)) throw new BadRequestException('Invalid course id')
    if (!mongoose.isValidObjectId(req.user.userId)) throw new BadRequestException('Invalid user id')
    if (!mongoose.isValidObjectId(dto.weekId)) throw new BadRequestException('Invalid week id')
    const videoUrl = process.env.BASE_URL + '/course/' + video.path

    return this.courseService.addLesson(dto, videoUrl, req.user.userId)
  }

  @Post('subscribe')
  @UseGuards(AtGuard)
  subscribe(@Query('courseId') courseId: string, @Req() req: Request & ReqUser) {
    if (!mongoose.isValidObjectId(courseId)) throw new BadRequestException('Invalid course id')
    if (!mongoose.isValidObjectId(req.user.userId)) throw new BadRequestException('Invalid user id')
    return this.courseService.subscribe(courseId, req.user.userId)
  }

  @Post('unsubscribe')
  @UseGuards(AtGuard)
  unsubscribe(@Query('courseId') courseId: string, @Req() req: Request & ReqUser) {
    if (!mongoose.isValidObjectId(courseId)) throw new BadRequestException('Invalid course id')
    if (!mongoose.isValidObjectId(req.user.userId)) throw new BadRequestException('Invalid user id')
    return this.courseService.unsubscribe(courseId, req.user.userId)
  }

  @Get('uploads/course-preview/:filename')
  @Header('Content-Type', 'image/png')
  getFile(@Param('filename') filename: string) {
    const file = createReadStream(join(process.cwd(), '/uploads/course-preview/' + filename))
    return new StreamableFile(file)
  }
  @Get('uploads/course-lesson/:filename')
  @Header('Content-Type', 'video/webm')
  getLessonVideo(@Param('filename') filename: string) {
    const file = createReadStream(join(process.cwd(), '/uploads/course-lesson/' + filename))
    return new StreamableFile(file)
  }

  @Get()
  findAll(@Req() req) {
    return this.courseService.findAll()
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('invalid id')
    }
    return this.courseService.findById(id)
  }
}
