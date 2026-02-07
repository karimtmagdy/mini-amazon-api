import { TokenPayload } from "./sessions.dto";
// Extend Request type using ES2015 module syntax
declare module "express-serve-static-core" {
  interface Request {
    user: TokenPayload;
  }
}
