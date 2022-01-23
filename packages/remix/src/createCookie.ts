import * as Remix from "remix";

export function createCookie(name = "tsi18n_cached") {
  return Remix.createCookie(name, {
    sameSite: "strict",
    httpOnly: true,
    path: "/",
  });
}
