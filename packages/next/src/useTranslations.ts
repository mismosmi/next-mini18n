import {
  useTranslations as useTranslationsBase,
  I18n,
  I18nDefinition,
  Messages,
} from "@tsi18n/react";

export function useTranslations<T extends I18nDefinition>(): I18n<T>;
export function useTranslations<T extends I18nDefinition, N extends keyof T>(
  ns: N
): Messages<T, N>;

export function useTranslations(ns: string | null = null) {
  // We know more than Typescript here:
  // This _will_ produce the right result when passed a null
  return useTranslationsBase(ns as string);
}
