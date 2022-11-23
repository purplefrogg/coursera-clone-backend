import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
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
}

export const UserSchema = SchemaFactory.createForClass(User);
