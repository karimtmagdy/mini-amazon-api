import { NextFunction, Request, Response } from "express";
import { jwtUitl } from "../lib/jwt.lib";
import { ApiError } from "../class/api.error";
import { catchError } from "../lib/catch.error";
import { UserRole } from "../contract/user.dto";
import { STATUS_CODE } from "../lib/statuscode";

export const authenticated = catchError(
  async (req: Request, _: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
      throw new ApiError(
        "No authentication header provided",
        STATUS_CODE.UNAUTHORIZED,
      );
    const token = authHeader.split(" ")[1];
    if (!token)
      throw new ApiError(
        "No authentication token provided",
        STATUS_CODE.UNAUTHORIZED,
      );
    try {
      const decodedToken = jwtUitl.verifyAccessToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      throw new ApiError(
        "Invalid authentication token",
        STATUS_CODE.UNAUTHORIZED,
      );
    }
  },
);

export const checkPermission = (roles: UserRole[] = ["admin"]) =>
  catchError(async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!user) throw new ApiError("No user found", STATUS_CODE.UNAUTHORIZED);

    if (!requiredRoles.includes(user.role as UserRole)) {
      throw new ApiError(
        "You do not have permission to perform this action",
        STATUS_CODE.FORBIDDEN,
      );
    }
    next();
  });
