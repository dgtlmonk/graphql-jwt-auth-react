import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "local":
    path = `${__dirname}/../.env.local`;
    break;
  case "production":
    path = `${__dirname}/../.env.production`;
    break;
  default:
    path = `${__dirname}/../.env.development`;
}
dotenv.config({ path: path });

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_REFRESH = process.env.ACCESS_TOKEN_REFRESH;
