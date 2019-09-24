import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { UserResolver } from "./resolvers/User"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createToken, TokenType, hydrateToken } from "./helpers/token";

(async () => {
  const app = express();
  app.use(cookieParser())
  app.post("/refresh-token", async (req, res) => {
    console.log('header cookies ', req.cookies);
    const token = req.cookies['jwt-auth'];

    if (!token) {
      return res.send({ ok: false, accessToken: '' })
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.ACCESS_TOKEN_REFRESH)
      console.log('payload ', payload)
    } catch (err) {

      console.log('invalid token? ', err);
      return res.send({ ok: false, accessToken: '' })
    }

    const user = await User.findOne({ id: payload.userId })

    if (!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    console.log('User authorized granted access token');
    // refresh token
    hydrateToken(res, TokenType.REFRESH, user);
    return res.send({ ok: true, accessToken: createToken(TokenType.ACCESS, user) })
  })

  await createConnection()
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [UserResolver] }),
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("Server running at port:4000");
  });
})();
