import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInModel } from './auth.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth-guard';
import { SignInInput } from './auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInModel)
  @UseGuards(GqlAuthGuard)
  /**
   * Signs in a user given a valid email and password combination.
   *
   * @param signInInput The input to sign in the user.
   * @param context The context of the request.
   *
   * @returns The signed in user.
   */
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
    @Context() context: any,
  ): Promise<SignInModel> {
    return await this.authService.signIn(context.user);
  }
}
