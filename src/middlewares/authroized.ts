import { NextFunction, Request, Response } from "express";
import { jwtUitl } from "../lib/jwt.lib";
import { ApiError } from "../class/api.error";
import { catchError } from "../lib/catch.error";
import { UserRole } from "../contract/user.dto";

export const authenticated = catchError(
  async (req: Request, _: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
      throw new ApiError("No authentication header provided", 401);
    const token = authHeader.split(" ")[1];
    if (!token) throw new ApiError("No authentication token provided", 401);
    try {
      const decodedToken = jwtUitl.verifyAccessToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      throw new ApiError("Invalid authentication token", 401);
    }
  },
);

export const checkPermission = (roles: UserRole[] = ["admin", "user"]) =>
  catchError(async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!user) throw new ApiError("No user found", 401);

    if (!requiredRoles.includes(user.role as UserRole)) {
      throw new ApiError(
        "You do not have permission to perform this action",
        403,
      );
    }
    next();
  });
