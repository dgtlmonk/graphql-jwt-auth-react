import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { UserResolver } from "./resolvers/User"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

(async () => {
  const app = express();
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
