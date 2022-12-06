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
import { join } from 'path'
import { of } from 'rxjs'
import { AtGuard, ReqUser } from 'src/auth/guard/at.guard'
import { CourseService } from './course.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { CreateWeekDto } from './dto/create-week.dto'

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/course-preview',
      fileFilter(req, file, callback) {
        if (file.mimetype.match('image')) {
          return callback(null, true)
        } else {
          return callback(new BadRequestException('File must be image'), false)
        }
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
  addWeek(@Body() dto: CreateWeekDto) {
    return this.courseService.addWeek(dto.week, dto.courseId)
  }

  @Post('setImage')
  @UseInterceptors(FileInterceptor('file'))
  setImage(@UploadedFile() file: Express.Multer.File) {
    return file
  }

  @Get('uploads/course-preview/:filename')
  @Header('Content-Type', 'image/png')
  getFile(@Res({ passthrough: true }) res, @Param('filename') filename: string) {
    const file = createReadStream(join(process.cwd(), '/uploads/course-preview/' + filename))
    return new StreamableFile(file)
  }
  @Get()
  findAll() {
    return this.courseService.findAll()
  }
}
