import { createCookie } from "./createCookie";
import { filterTranslations } from "@tsi18n/react";
import { json } from "remix";

export async function filterDataRequestTranslations(
  request: Request,
  response: Response,
  cookieName?: string
): Promise<Response> {
  const cookie = createCookie(cookieName);

  const cached = await cookie.parse(request.headers.get("Cookie"));

  if (response.ok) {
    let body;
    try {
      body = await response.json();
    } catch {
      return response;
    }

    if (!body.tsi18n) {
      return response;
    }

    filterTranslations(body.tsi18n, cached);

    response.headers.set("Set-Cookie", await cookie.serialize(cached));

    return json(body, response);
  }

  return response;
}
