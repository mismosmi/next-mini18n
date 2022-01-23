import { renderToString } from "react-dom/server";
import {
  HandleDataRequestFunction,
  RemixServer,
  createCookie,
  json,
} from "remix";
import type { EntryContext } from "remix";
import { filterTranslations } from "@tsi18n/core";
import jsesc from "jsesc";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cached: [string | null, string[]] = [null, []];

  for (const data of Object.values(remixContext.routeData)) {
    if (!cached[0]) {
      cached[0] = data.i18n[0];
    }

    filterTranslations(data.i18n, cached);
  }

  if (remixContext.serverHandoffString) {
    const serverHandoff = eval(`(${remixContext.serverHandoffString})`);
    serverHandoff.routeData = remixContext.routeData;
    remixContext.serverHandoffString = jsesc(serverHandoff);
  }

  responseHeaders.set("Set-Cookie", await cookie.serialize(cached));

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

const cookie = createCookie("tsi18n_cached", {
  sameSite: "strict",
  httpOnly: true,
  path: "/",
});

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { params, request }
) => {
  const cached = await cookie.parse(request.headers.get("Cookie"));
  console.log("handleDataRequest");

  if (response.ok) {
    let body;
    try {
      body = await response.json();
    } catch {
      return response;
    }

    if (!body.i18n) {
      return response;
    }

    filterTranslations(body.i18n, cached);
    response.headers.set("Set-Cookie", await cookie.serialize(cached));

    return json(body, response);
  }

  return response;
};
