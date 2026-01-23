import type { Context } from "@fresh/core";
import type { SessionData, SessionState } from "../Session.ts";

export default interface Store {
  getSessionById(
    sessionId?: string,
  ): Promise<SessionData | null> | SessionData | null;
  createSession(
    sessionId: string,
    initialData: SessionData,
  ): Promise<void> | void;
  persistSessionData(
    sessionId: string,
    sessionData: SessionData,
  ): Promise<void> | void;
  deleteSession(
    sessionIdOrContext: string | Context<SessionState>,
  ): Promise<void> | void;
}
