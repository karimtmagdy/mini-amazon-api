import { Schema, Types, model } from "mongoose";
import type { DeviceInfo, SessionDto } from "../contract/sessions.dto";

const deviceInfoSchema = new Schema<DeviceInfo>(
  {
    browser: {
      name: String,
      version: String,
    },
    os: {
      name: String,
      version: String,
    },
    engine: String,
    cpu: String,
    ip: String,
    region: String,
    city: String,
    country: String,
  },
  { _id: false },
);

const sessionSchema = new Schema<SessionDto>({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  refreshToken: { type: String, required: true },
  deviceInfo: { type: deviceInfoSchema, default: {} },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
  createdAt: { type: Date, default: Date.now },
});

export const Session = model<SessionDto>("Session", sessionSchema);
