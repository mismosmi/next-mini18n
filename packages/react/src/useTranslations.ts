import * as React from "react";
import { I18n, I18nDefinition, I18nInTransport, Messages } from "@tsi18n/core";
import { TranslationContext } from "./TranslationContext";

export function useTranslations<T extends I18nDefinition>(): I18n<T>;
export function useTranslations<T extends I18nDefinition>(
  i18n: I18nInTransport
): I18n<T>;
export function useTranslations<T extends I18nDefinition, N extends keyof T>(
  ns: N
): Messages<T, N>;
export function useTranslations<T extends I18nDefinition, N extends keyof T>(
  i18n: I18nInTransport,
  ns: N
): Messages<T, N>;

export function useTranslations(
  arg0: string | I18nInTransport | null = null,
  arg1: string | null = null
) {
  const cx = React.useContext(TranslationContext);
  const previousI18n = React.useRef<I18nInTransport | null>(null);

  const [i18n, ns] = typeof arg0 === "string" ? [null, arg0] : [arg0, arg1];

  if (i18n && previousI18n.current !== i18n) {
    cx.update(i18n);
    previousI18n.current = i18n;
  }

  if (ns) {
    return cx.getNamespace(ns);
  }

  return cx.getAll();
}
