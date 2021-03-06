import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { Context } from "../helpers/Context";
import { createToken, TokenType, hydrateToken } from "../helpers/token";
import { isAuth } from "../helpers/middleware/isAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
class GenericResponse {
  @Field()
  message?: string;
  @Field()
  success: boolean;
}
@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => String)
  hello() {
    return "hello from graph ql";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  unauthorized(@Ctx() { payload }: Context) {
    console.log("payload ", payload);
    return `User ${payload} is not authorized to use graphql`;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req, res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("could not find user");
    }
    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }

    // refresh token
    hydrateToken(res, TokenType.REFRESH, user);

    return {
      accessToken: createToken(TokenType.ACCESS, user)
    };
  }

  @Mutation(() => GenericResponse)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password") password: string
  ): Promise<GenericResponse> {
    try {
      const user = await User.findOne({ where: { email } });

      if (user) {
        return {
          message: "user already exists",
          success: false
        };
      }

      const hashedPassword = await hash(password, 12);
      await User.insert({
        email,
        password: hashedPassword
      });

      return {
        message: "register success",
        success: true
      };
    } catch (e) {
      console.log("Error inserting user ", e);
      return {
        message: `Something went wrong. ${e}`,
        success: false
      };
    }
  }
}
