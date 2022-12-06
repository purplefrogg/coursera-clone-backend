import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'atStrategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: "15m",
      secretOrKey: 'at_secret',
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub }
  }
}
