import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import type { IdPayload, TokenPayload } from "../contract/sessions.dto";

// export interface CartPayload {
//   cartId: string;
// }

// export interface ResetPayload extends JWTPayload {
//   email: string;
// }
const { ACCESS_TOKEN, ACCESS_EXPIRES_IN, REFRESH_TOKEN, REFRESH_EXPIRES_IN } =
  process.env;
class JWT {
  private sign(
    payload: TokenPayload | IdPayload,
    secret: Secret,
    expiresIn: StringValue,
  ): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
  }
  private verify<T>(token: string, secret: Secret): T {
    return jwt.verify(token, secret) as T;
  }
  generateAccessToken(payload: TokenPayload): string {
    return this.sign(
      payload,
      ACCESS_TOKEN as Secret,
      ACCESS_EXPIRES_IN as StringValue,
    );
  }
  verifyAccessToken(token: string): TokenPayload {
    return this.verify<TokenPayload>(token, ACCESS_TOKEN as Secret);
  }
  generateRefreshToken(payload: IdPayload): string {
    return this.sign(
      payload,
      REFRESH_TOKEN as Secret,
      REFRESH_EXPIRES_IN as StringValue,
    );
  }
  verifyRefreshToken(token: string): IdPayload {
    return this.verify<IdPayload>(token, REFRESH_TOKEN as Secret);
  }
  //   generateCartToken(payload: CartPayload): string {
  //     return this.sign(
  //       payload,
  //       jwtConfig.cartSecret as Secret,
  //       jwtConfig.refreshExpiresIn as StringValue,
  //     );
  //   }
  //   verifyCartToken(token: string): CartPayload {
  //     return this.verify<CartPayload>(token, jwtConfig.cartSecret as Secret);
  //   }
  //   generateResetToken(payload: ResetPayload): string {
  //     return this.sign(
  //       payload,
  //       jwtConfig.resetSecret as Secret,
  //       jwtConfig.resetExpiresIn as StringValue,
  //     );
  //   }
  //   verifyResetToken(token: string): ResetPayload {
  //     return this.verify<ResetPayload>(token, jwtConfig.resetSecret as Secret);
  //   }
}

export const jwtUitl = new JWT();
