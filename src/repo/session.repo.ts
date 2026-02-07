import { Session } from "../models/sessions.model";
import { Types } from "mongoose";
import type { SessionDto } from "../contract/sessions.dto";

export class SessionRepository {
  async create(data: Partial<SessionDto>) {
    return await Session.create(data);
  }
  async findByToken(refreshToken: string) {
    return await Session.findOne({ refreshToken }).exec();
  }
  async findByUserId(userId: string | Types.ObjectId) {
    return await Session.find({ userId:new Types.ObjectId(userId) }).exec();
  }
  async deleteByToken(refreshToken: string) {
    return await Session.deleteOne({ refreshToken });
  }
  async deleteByUserId(userId: string | Types.ObjectId) {
    return await Session.deleteMany({ userId: new Types.ObjectId(userId) });
  }
  async deleteOtherSessions(
    userId: string | Types.ObjectId,
    currentToken: string,
  ) {
    return await Session.deleteMany({
      userId: new Types.ObjectId(userId),
      refreshToken: { $ne: currentToken },
    });
  }
}

export const sessionRepo = new SessionRepository();
