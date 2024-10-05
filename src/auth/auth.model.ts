import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from 'src/user/user.model';

@ObjectType()
export class SignInModel {
  @Field()
  accessToken: string;

  @Field(() => UserModel)
  user: UserModel;
}
