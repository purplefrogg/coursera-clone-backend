import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export interface ReqUser {
  user: {
    userId: string;
  };
}

@Injectable()
export class AtGuard extends AuthGuard("atStrategy") { }
