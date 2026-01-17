import type Store from "./Store.ts";
import type { SessionData } from "../Session.ts";
import type { Client } from "@db/postgres";

export default class PostgresStore implements Store {
  sql: Client;
  tableName: string;

  constructor(sql: Client, tableName = "sessions") {
    this.sql = sql;
    this.tableName = tableName;
  }

  async initSessionsTable(): Promise<void> {
    await this.sql
      .queryArray`create table if not exists ${this.tableName} (id varchar(21) not null primary key, data varchar)`;
  }

  async getSessionById(sessionId: string): Promise<SessionData | null> {
    const result = await this.sql
      .queryObject<
      { data: string }
    >`select data from ${this.tableName} where id = ${sessionId}`;
    const s = result?.rows.at(0);
    if (!result) return null;
    return s ? JSON.parse(result.rows[0].data) as SessionData : null;
  }

  async createSession(
    sessionId: string,
    initialData: SessionData,
  ): Promise<void> {
    await this.sql
      .queryArray`insert into ${this.tableName} (id, data) values (${sessionId}, ${
      JSON.stringify(initialData)
    })`;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sql
      .queryArray`delete from ${this.tableName} where id = ${sessionId}`;
  }

  async persistSessionData(
    sessionId: string,
    sessionData: SessionData,
  ): Promise<void> {
    await this.sql.queryArray`update ${this.tableName} set data = ${
      JSON.stringify(sessionData)
    } where id = ${sessionId}`;
  }
}
