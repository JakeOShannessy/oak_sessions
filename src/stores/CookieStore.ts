import type { Context } from "@fresh/core";
import { decryptCryptoJSAES, encryptCryptoJSAES } from "../crypto.ts";
import type { SessionData, SessionState } from "../Session.ts";
import { deleteCookie, getCookies, setCookie } from "@std/http";

interface CookieStoreOptions {
  sessionDataCookieName?: string;
}

export default class CookieStore {
  encryptionKey: string;
  sessionDataCookieName: string;

  constructor(encryptionKey: string, options?: CookieStoreOptions) {
    this.encryptionKey = encryptionKey;
    this.sessionDataCookieName = options?.sessionDataCookieName ??
      "session_data";
  }

  async getSessionByCtx(
    ctx: Context<SessionState>,
  ): Promise<SessionData | null> {
    const sessionDataString: string | undefined =
      getCookies(ctx.req.headers)[this.sessionDataCookieName];

    if (!sessionDataString) return null;

    try {
      const decryptedCookie = await decryptCryptoJSAES(
        sessionDataString,
        this.encryptionKey,
      );
      return JSON.parse(decryptedCookie);
    } catch {
      return null;
    }
  }

  deleteSession(headers: Headers) {
    deleteCookie(headers, this.sessionDataCookieName);
  }

  async persistSessionData(headers: Headers, data: SessionData) {
    const dataString = JSON.stringify(data);

    const encryptedCookie = await encryptCryptoJSAES(
      dataString,
      this.encryptionKey,
    );
    setCookie(headers, {
      name: this.sessionDataCookieName,
      value: encryptedCookie,
      path: "/",
      sameSite: "None",
      secure: true,
      httpOnly: true,
      maxAge: 86400,
    });
  }
}
