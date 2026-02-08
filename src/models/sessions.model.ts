import { Schema, Types, model } from "mongoose";
import type { SessionDto } from "../contract/sessions.dto";

const deviceInfoSchema = new Schema(
  {
    browser: {
      name: { type: String, default: "unknown" },
      version: { type: String, default: "unknown" },
    },
    os: {
      name: { type: String, default: "unknown" },
      version: { type: String, default: "unknown" },
    },
    engine: { type: String, default: "unknown" },
    cpu: { type: String, default: "unknown" },
    ip: { type: String, default: "unknown" },
    region: { type: String, default: "unknown" },
    city: { type: String, default: "unknown" },
    country: { type: String, default: "unknown" },
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
