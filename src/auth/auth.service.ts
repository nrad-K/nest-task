import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInModel } from './auth.model';
import { JwtPayload } from './types/auth';

@Injectable()
export class AuthService {
  /**
   * The constructor for the AuthService class.
   *
   * This constructor creates an instance of the AuthService class and
   * initializes it with the given services.
   *
   * @param userService The service to use to interact with the user database.
   * @param jwtService The service to use to generate JSON Web Tokens.
   */
  constructor(
    /**
     * The service to use to interact with the user database.
     */
    private readonly userService: UserService,
    /**
     * The service to use to generate JSON Web Tokens.
     */
    private readonly jwtService: JwtService,
  ) {}

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
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async signIn(user: User): Promise<SignInModel> {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload), user };
  }
}
