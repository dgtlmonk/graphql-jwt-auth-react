import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { UserResolver } from "./resolvers/User"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";

(async () => {
  const app = express();
  app.use(cookieParser())
  app.post("/refresh-token", (req, res) => {
    console.log('header cookies ', req.cookies);
    const token = req.cookies['jwt_auth'];

    if (!token) {
      return res.send({ ok: false, accessToken: '' })
    }
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
