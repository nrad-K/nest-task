import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserInput, GetUserArgs } from './user.dto';
import { UserModel } from './user.model';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user.
   *
   * @param createUserInput The input data for the user to create.
   * @returns The created user.
   *
   * @throws {HttpException} If the user cannot be created.
   */
  @Mutation(() => UserModel)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    try {
      return await this.userService.createUser(createUserInput);
    } catch {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Gets a user by email.
   *
   * @param getUserArgs The input to get the user.
   *
   * @throws {HttpException} If the user associated with the given email does
   * not exist.
   *
   * @returns The found user.
   */
  @Query(() => UserModel, { nullable: true })
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(getUserArgs.email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch {
      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
