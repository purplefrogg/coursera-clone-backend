import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  mail: string;

  @IsString()
  password: string;
}
