import { TranslationDefinition, TranslationInTransport } from "./Translations";

export function loadTranslations<T extends TranslationDefinition>(
  i18n: T,
  locale: string
): TranslationInTransport {
  return [
    locale,
    Object.entries(i18n).map(([ns, translations]) => {
      const localizedTranslations = translations[locale];

      if (!localizedTranslations) {
        throw new Error(
          `Missing translation for locale "${locale}" and namespace "${ns}"`
        );
      }

      return [ns, localizedTranslations];
    }),
  ];
}
