import { Type } from 'class-transformer'
import { IsArray, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'

class Lesson {
  @IsString()
  name: string

  @IsString()
  content: string
}

export class Week {
  @IsString()
  name: string

  @IsString()
  about: string

  // @IsOptional()
  // @ValidateNested()
  // @IsArray()
  // @Type(() => Lesson)
  // lessons: Lesson[]
}

export class CreateWeekDto {
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => Week)
  week: Week

  @IsString()
  courseId: string
}
