import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Course } from "src/course/course.schema";
import { Role } from "./roles.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  lname: string;

  @Prop({ unique: true })
  mail: string;

  @Prop()
  activated: boolean;

  @Prop()
  password: string;

  @Prop()
  roles: Role[];

  @Prop()
  createdDate: Date;

  @Prop()
  refreshToken: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }] })
  createdCourse: Course[];
}

export const UserSchema = SchemaFactory.createForClass(User);
