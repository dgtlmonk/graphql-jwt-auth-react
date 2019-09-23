import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql'
import { hash, compare } from 'bcryptjs'
import { User } from '../entity/User'
import { Context } from '../helpers/Context'
import { createToken, TokenType } from '../helpers/token'
import { isAuth } from '../helpers/middleware/isAuth'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find()
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  unauthorized(@Ctx() { payload }: Context) {
    console.log('payload ', payload)
    return `User ${payload} is not authorized to use graphql`
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req, res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error('could not find user')
    }
    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('bad password')
    }
    // refresh token
    res.cookie('jwt-auth',
      createToken(TokenType.REFRESH, user),
      {
        httpOnly: true
      }
      // more options
    )

    return {
      accessToken: createToken(TokenType.ACCESS, user)
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email', () => String) email: string,
    @Arg('password') password: string,
  ) {
    try {
      const hashedPassword = await hash(password, 12)
      await User.insert({
        email,
        password: hashedPassword
      })
      return true
    } catch (e) {
      console.log("Error inserting user ", e);
      return false;
    }
  }
}