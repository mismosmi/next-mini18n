import { I18nInTransport } from "./types";

export function filterTranslations(
  i18n: I18nInTransport,
  cached: [string | null, string[]]
): void {
  // if requested locale is not cached
  if (cached[0] !== i18n[0]) {
    // new cached locale is requested locale
    cached[0] = i18n[0];
    // cached namespaces are all served namespaces
    cached[1] = i18n[1].map(([ns]) => ns);
  }

  // serve only namespaces that have not been cached before
  i18n[1] = i18n[1].filter(([ns]) => !cached[1].includes(ns));
  // add served namespaces to cached ones
  cached[1].concat(i18n[1].map(([ns]) => ns));
}
