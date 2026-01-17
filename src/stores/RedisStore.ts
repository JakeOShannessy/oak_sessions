import type Store from "./Store.ts";
import type { Redis } from "@db/redis";
import type { SessionData } from "../Session.ts";

export default class RedisStore implements Store {
  keyPrefix: string;
  db: Redis;

  constructor(db: Redis, keyPrefix = "session_") {
    this.keyPrefix = keyPrefix;
    this.db = db;
  }

  async getSessionById(sessionId: string): Promise<SessionData | null> {
    const session = await this.db.get(this.keyPrefix + sessionId);

    if (session) {
      const sessionString = String(
        await this.db.get(this.keyPrefix + sessionId),
      );
      const value = JSON.parse(sessionString) as SessionData;
      return value;
    } else {
      return null;
    }
  }

  async createSession(
    sessionId: string,
    initialData: SessionData,
  ): Promise<void> {
    await this.db.set(this.keyPrefix + sessionId, JSON.stringify(initialData));
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.db.del(this.keyPrefix + sessionId);
  }

  async persistSessionData(
    sessionId: string,
    sessionData: SessionData,
  ): Promise<void> {
    await this.db.set(this.keyPrefix + sessionId, JSON.stringify(sessionData));
  }
}
