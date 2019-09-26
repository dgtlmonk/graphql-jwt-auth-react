import { User } from "../entity/User";
import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_REFRESH } from "../config/dotenv";
import { Response } from "express";

export enum TokenType {
  ACCESS,
  REFRESH
}

export const createToken = (type: TokenType, user: User) => {
  if (type === TokenType.ACCESS) {
    return sign({ userId: user.id }, `${ACCESS_TOKEN_SECRET}`, {
      expiresIn: "15m"
    });
  }

  if (type === TokenType.REFRESH) {
    return sign({ userId: user.id }, `${ACCESS_TOKEN_REFRESH}`, {
      expiresIn: "7d"
    });
  }
};

export const hydrateToken = (res: Response, type: TokenType, user: User) => {
  // FIXME: dependency validation needed
  if (type === TokenType.REFRESH) {
    res.cookie(
      "jwt-auth",
      createToken(TokenType.REFRESH, user),
      {
        httpOnly: true
      }
      // more options
    );
  }
};
