import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AtGuard, ReqUser } from 'src/auth/guard/at.guard'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('profile')
  async profile(@Req() req: Request & ReqUser) {
    return await this.userService.findById(req.user.userId)
  }

  @UseGuards(AtGuard)
  @Get('in-progress-courses')
  async inProgressCourses(@Req() req: Request & ReqUser) {
    return await this.userService.getInProgressCourses(req.user.userId)
  }
  @UseGuards(AtGuard)
  @Get('created-courses')
  async createdCourses(@Req() req: Request & ReqUser) {
    return await this.userService.getCreatedCourses(req.user.userId)
  }
}
