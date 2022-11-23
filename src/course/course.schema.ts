import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  createdDate: Date;

  @Prop()
  creatorName: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
