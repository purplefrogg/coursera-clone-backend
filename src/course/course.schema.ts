import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CourseDocument = HydratedDocument<Course>

@Schema()
export class Course {
  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  imageUrl: string

  @Prop()
  createdDate: Date

  @Prop()
  creatorName: string

  @Prop({ name: { unique: true }, required: false })
  weeks: {
    name: string
    about: string
    lessons: {
      name: string
      content: string
    }[]
  }[]
}

export const CourseSchema = SchemaFactory.createForClass(Course)
