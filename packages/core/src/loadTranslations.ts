import { I18nDefinition, I18nInTransport, Messages } from "./types";

export function loadTranslations<T extends I18nDefinition>(
  i18n: T,
  locale: string
): I18nInTransport<T> {
  return [
    locale,
    Object.entries(i18n).map(
      ([name, namespace]): [keyof T, Messages<T, keyof T>] => {
        const messages = namespace[locale];

        if (!messages) {
          throw new Error(
            `Missing translation for locale "${locale}" and namespace "${name}"`
          );
        }

        return [name as keyof T, messages as Messages<T, keyof T>];
      }
    ),
  ];
}
