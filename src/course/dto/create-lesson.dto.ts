import { IsString } from 'class-validator'

export class CreateLessonDto {
  @IsString()
  name: string

  @IsString()
  content: string

  @IsString()
  weekId: string

  @IsString()
  courseId: string
}
