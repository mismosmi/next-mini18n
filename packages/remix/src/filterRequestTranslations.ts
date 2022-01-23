import { EntryContext } from "remix";
import { filterTranslations } from "@tsi18n/react";
import jsesc from "jsesc";
import { createCookie } from "./createCookie";

export async function filterRequestTranslations(
  responseHeaders: Headers,
  remixContext: EntryContext,
  cookieName?: string
) {
  const cached: [string | null, string[]] = [null, []];

  for (const data of Object.values(remixContext.routeData)) {
    if (!cached[0]) {
      cached[0] = data.tsi18n[0];
    }

    filterTranslations(data.tsi18n, cached);
  }

  if (remixContext.serverHandoffString) {
    const serverHandoff = eval(`(${remixContext.serverHandoffString})`);
    serverHandoff.routeData = remixContext.routeData;
    remixContext.serverHandoffString = jsesc(serverHandoff);
  }

  responseHeaders.set(
    "Set-Cookie",
    await createCookie(cookieName).serialize(cached)
  );
}
