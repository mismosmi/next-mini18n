import { TranslationInTransport } from "./Translations";

export function filterTranslations<T extends TranslationInTransport>(
  i18n: T,
  cached: [string | null, string[]]
): T {
  if (cached[0] !== i18n[0]) {
    cached[0] = i18n[0];
    cached[1] = i18n[1].map(([ns]) => ns);

    return i18n;
  }

  i18n[1] = i18n[1].filter(([ns]) => {
    if (cached[1].includes(ns)) {
      return false;
    }

    cached[1].push(ns);
    return true;
  });

  return i18n;
}
