import { type JwtPayload } from "jsonwebtoken";
import { type ObjectId } from "mongoose";
import type { UserDto } from "./user.dto";
// import type { IResult } from "ua-parser-js";

export type SessionDto = {
  refreshToken: string;
  userId: string | ObjectId;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  expiresAt: Date;
};
export type DeviceInfo = {
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  engine: string;
  cpu: string;
  ip: string;
  region: string;
  city: string;
  country: string;
};
export type TokenPayload = Pick<UserDto, "id" | "email" | "username" | "role"> &
  JwtPayload;
export type IdPayload = Pick<UserDto, "id"> & JwtPayload;
