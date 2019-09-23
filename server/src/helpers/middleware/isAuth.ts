import { MiddlewareFn } from "type-graphql";
import { Context } from '../Context';
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from '../../config/dotenv'


// we're expecting for authorization token
// bearer somehash123

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error("Not authenticated")
  }

  try {
    const token = authorization.split('')[1];
    const payload = verify(token, ACCESS_TOKEN_SECRET);

    context.payload = payload as any;
  } catch (error) {
    console.log('Error reading token ', error);
  }
  return next();
}