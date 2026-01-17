import type Store from "./Store.ts";
import type { Collection, Database } from "@db/mongo";
import type { SessionData } from "../Session.ts";

interface MongoSession {
  id: string;
  data: SessionData;
}

export default class MongoStore implements Store {
  db: Database;
  sessions: Collection<MongoSession>;

  constructor(db: Database, collectionName = "sessions") {
    this.db = db;
    this.sessions = db.collection(collectionName);
  }

  async getSessionById(sessionId: string): Promise<SessionData | null> {
    const session = await this.sessions.findOne({ id: sessionId });

    return session ? session.data : null;
  }

  async createSession(
    sessionId: string,
    initialData: SessionData,
  ): Promise<void> {
    await this.sessions.replaceOne(
      { id: sessionId },
      {
        id: sessionId,
        data: initialData,
      },
      { upsert: true },
    );
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessions.deleteOne({ id: sessionId });
  }

  async persistSessionData(
    sessionId: string,
    sessionData: SessionData,
  ): Promise<void> {
    await this.sessions.replaceOne(
      { id: sessionId },
      {
        id: sessionId,
        data: sessionData,
      },
      { upsert: true },
    );
  }
}
