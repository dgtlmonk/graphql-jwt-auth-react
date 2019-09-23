import { User } from "../entity/User"
import { sign } from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_REFRESH } from '../config/dotenv'

export enum TokenType {
  ACCESS = 'ACCESS TOKEN',
  REFRESH = 'RERESH TOKEN'
}

export const createToken = (type: TokenType, user: User) => {
  if (type === TokenType.ACCESS) {
    return sign({ userId: user.id }, `${ACCESS_TOKEN_SECRET}`, {
      expiresIn: "15m"
    })
  }

  if (type === TokenType.REFRESH) {
    return sign({ userId: user.id }, `${ACCESS_TOKEN_REFRESH}`, { expiresIn: "7d" })
  }
}