import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { JwtPayload } from '../types/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * JwtStrategy constructor.
   *
   * This constructor creates an instance of the Strategy class
   * and initializes it with the provided configuration.
   *
   * @param userService The service to use to authenticate users.
   */
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validate the given JWT payload.
   *
   * @param payload The payload extracted from the JWT token.
   * @returns The user associated with the given payload.
   * @throws {HttpException} If the user associated with the given payload does
   * not exist.
   */
  async validate(payload: JwtPayload): Promise<User | null> {
    try {
      return await this.userService.getUserByEmail(payload.email);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
