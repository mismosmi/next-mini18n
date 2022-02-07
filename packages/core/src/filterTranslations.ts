import { I18nDefinition, I18nInTransport } from "./types";

export function filterTranslations<T extends I18nDefinition = I18nDefinition>(
  i18n: I18nInTransport<T>,
  cached: [string | null, (keyof T)[]]
): void {
  // if requested locale is not cached
  if (cached[0] !== i18n[0]) {
    // new cached locale is requested locale
    cached[0] = i18n[0] as string;
    // cached namespaces are all served namespaces
    cached[1] = i18n[1].map(([ns]) => ns);
    return;
  }

  // serve only namespaces that have not been cached before
  i18n[1] = i18n[1].filter(([ns]) => !cached[1].includes(ns));
  // add served namespaces to cached ones
  cached[1].concat(i18n[1].map(([ns]) => ns));
}
