import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { CourseModule } from './course/course.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot("mongodb://127.0.0.1:27017"),
    AuthModule,
    CourseModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
