import { renderToString } from "react-dom/server";
import { HandleDataRequestFunction, RemixServer } from "remix";
import type { EntryContext } from "remix";
import {
  filterRequestTranslations,
  filterDataRequestTranslations,
} from "@tsi18n/remix";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  filterRequestTranslations(responseHeaders, remixContext);

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export const handleDataRequest: HandleDataRequestFunction = async (
  response,
  { request }
) => {
  return filterDataRequestTranslations(request, response);
};
