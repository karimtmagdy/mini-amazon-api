import { Session } from "../models/sessions.model";
import type { SessionDto } from "../contract/sessions.dto";

export class SessionRepository {
  async create(data: Partial<SessionDto>) {
    return await Session.create(data);
  }
  async findByToken(refreshToken: string) {
    return await Session.findOne({ refreshToken }).exec();
  }
  async findByUserId(userId: string) {
    return await Session.find({ userId }).exec();
  }
  async deleteByToken(refreshToken: string) {
    return await Session.deleteOne({ refreshToken });
  }
  async deleteByUserId(userId: string) {
    return await Session.deleteMany({ userId });
  }
  async deleteOtherSessions(userId: string, currentToken: string) {
    return await Session.deleteMany({
      userId,
      refreshToken: { $ne: currentToken },
    });
  }
}

export const sessionRepo = new SessionRepository();
