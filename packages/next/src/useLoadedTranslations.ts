import { I18nInTransport } from "@tsi18n/core";
import { useTranslations as useTranslationsBase } from "@tsi18n/react";

export function useLoadedTranslations(i18n: I18nInTransport): void {
  useTranslationsBase(i18n);
}
