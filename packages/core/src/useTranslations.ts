import * as React from "react";
import { TranslationDefinition, TranslationInTransport } from "./Translations";
import { TranslationContext } from "./TranslationContext";

export function useTranslations<T extends TranslationDefinition>(): T;
export function useTranslations<T extends TranslationDefinition>(
  i18n: TranslationInTransport
): { [ns in keyof T]: T[ns][keyof T[ns]] };
export function useTranslations<
  T extends TranslationDefinition,
  N extends keyof T
>(ns: N): T[N][keyof T[N]];
export function useTranslations<
  T extends TranslationDefinition,
  N extends keyof T
>(i18n: TranslationInTransport, ns: N): T[N][keyof T[N]];

export function useTranslations(
  arg0: string | TranslationInTransport | null = null,
  arg1: string | null = null
) {
  const cx = React.useContext(TranslationContext);
  const previousI18n = React.useRef<TranslationInTransport | null>(null);

  const [i18n, ns] = typeof arg0 === "string" ? [null, arg0] : [arg0, arg1];

  console.log(i18n);

  if (i18n && previousI18n.current !== i18n) {
    cx.update(i18n);
    previousI18n.current = i18n;
  }

  if (ns) {
    return cx.getNamespace(ns);
  }

  return cx.getAll();
}
