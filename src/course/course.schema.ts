import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type WeekDocument = Week & Partial<mongoose.Document>;

@Schema()
export class Week {
  @Prop()
  name: string;

  @Prop()
  about: string;

  @Prop()
  lessons?: {
    name: string;
    content: string;
    videoUrl: string;
  }[];
}

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop()
  createdDate: Date;

  @Prop()
  creatorName: string;

  @Prop({ default: 0 })
  subscribers: number;

  @Prop([Week])
  weeks: [WeekDocument];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
