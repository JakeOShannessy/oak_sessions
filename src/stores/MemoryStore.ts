import type Store from "./Store.ts";
import type { SessionData } from "../Session.ts";

export default class MemoryStore implements Store {
  data: Map<string, SessionData>;

  constructor() {
    this.data = new Map();
  }

  getSessionByCtx(sessionId: string): SessionData | null {
    return this.data.has(sessionId) ? this.data.get(sessionId)! : null;
  }

  getSessionById(sessionId: string): SessionData | null {
    return this.data.has(sessionId) ? this.data.get(sessionId)! : null;
  }

  createSession(sessionId: string, initialData: SessionData): void {
    this.data.set(sessionId, initialData);
  }

  deleteSession(sessionId: string): void {
    this.data.delete(sessionId);
  }

  persistSessionData(sessionId: string, sessionData: SessionData): void {
    this.data.set(sessionId, sessionData);
  }
}
