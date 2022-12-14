import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { compare } from 'bcrypt'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { log } from 'console'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/user/user.schema'
import { Model } from 'mongoose'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rtStrategy') {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies.refresh
      },
      ignoreExpiration: '30d',
      secretOrKey: 'rt_secret',
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: any) {
    log('rtStrategy')
    const user = await this.userModel.findById(payload.sub)
    if (!user || !user.refreshToken) return null
    const isValid = await compare(req.cookies.refresh, user.refreshToken)
    log('rtStrategy.isValid', isValid)
    if (!isValid) return null

    const accessToken = await this.jwtService.signAsync({ sub: user.id }, { secret: 'at_secret', expiresIn: '10s' })
    return accessToken
  }
}
