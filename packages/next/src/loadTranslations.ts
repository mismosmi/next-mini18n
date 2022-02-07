import {
  loadTranslations as loadTranslationsBase,
  filterTranslations,
  I18nDefinition,
} from "@tsi18n/react";
import Cookies from "cookies";
import { GetServerSidePropsContext } from "next";

export function loadTranslations<T extends I18nDefinition>(
  i18n: T,
  {
    req,
    res,
    locale,
  }: Pick<GetServerSidePropsContext, "req" | "res" | "locale">
) {
  const cookies = new Cookies(req, res);

  const isDataRequest = req.url?.startsWith("/_next/data");

  const translations = loadTranslationsBase(i18n, locale as string);

  if (isDataRequest) {
    const cookieValue = cookies.get("tsi18n_cached");
    const cached = cookieValue ? JSON.parse(cookieValue) : [null, []];

    filterTranslations(translations, cached);

    cookies.set("tsi18n_cached", JSON.stringify(cached), cookieSettings);
  } else {
    cookies.set(
      "tsi18n_cached",
      JSON.stringify([locale, translations[1].map(([ns]) => ns)]),
      cookieSettings
    );
  }

  return translations;
}

const cookieSettings = {
  httpOnly: true,
  sameSite: "strict",
  path: "/",
} as const;
