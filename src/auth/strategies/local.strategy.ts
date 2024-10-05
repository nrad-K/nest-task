import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs a LocalStrategy instance.
   *
   * @param authService The service responsible for authenticating users.
   *
   * @see AuthService
   */
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates the given email and password.
   *
   * @param email The email of the user to validate.
   * @param password The password of the user to validate.
   *
   * @throws {HttpException} If the user associated with the given credentials
   * does not exist.
   *
   * @returns The user associated with the given credentials.
   */
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
