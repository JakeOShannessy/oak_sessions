import type { Database } from "@db/sqlite";
import type Store from "./Store.ts";
import type { SessionData } from "../Session.ts";

export default class SqliteStore implements Store {
  db: Database;
  tableName: string;

  constructor(db: Database, tableName = "sessions") {
    this.db = db;
    this.tableName = tableName;
    this.db.prepare(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (id TEXT, data TEXT)`,
    );
  }

  getSessionById(
    sessionId: string,
  ): SessionData | null {
    let session = "";

    for (
      const [sess] of this.db.prepare<string[]>(
        `SELECT data FROM ${this.tableName} WHERE id = ?`,
      ).values([sessionId])
    ) {
      session = sess;
    }

    return session ? JSON.parse(session) as SessionData : null;
  }

  createSession(sessionId: string, initialData: SessionData): void {
    this.db.prepare(`INSERT INTO ${this.tableName} (id, data) VALUES (?, ?)`)
      .values([
        sessionId,
        JSON.stringify(initialData),
      ]);
  }

  deleteSession(sessionId: string): void {
    this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`).values([
      sessionId,
    ]);
  }

  persistSessionData(sessionId: string, sessionData: SessionData): void {
    this.db.prepare(`UPDATE ${this.tableName} SET data = ? WHERE id = ?`)
      .values([
        JSON.stringify(sessionData),
        sessionId,
      ]);
  }
}
