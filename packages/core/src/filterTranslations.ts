import { I18nInTransport } from "./types";

export function filterTranslations(
  i18n: I18nInTransport,
  cached: [string | null, string[]]
): void {
  if (cached[0] !== i18n[0]) {
    cached[0] = i18n[0];
    cached[1] = i18n[1].map(([ns]) => ns);
  }

  i18n[1] = i18n[1].filter(([ns]) => !cached[1].includes(ns));
  cached[1].concat(i18n[1].map(([ns]) => ns));
}
