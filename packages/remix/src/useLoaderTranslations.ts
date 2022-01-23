import {
  useTranslations as useTranslationsBase,
  I18n,
  I18nDefinition,
  Messages,
} from "@tsi18n/react";
import { useLoaderData } from "remix";

export function useLoaderTranslations<T extends I18nDefinition>(): I18n<T>;
export function useLoaderTranslations<
  T extends I18nDefinition,
  N extends keyof T
>(ns: N): Messages<T, N>;

export function useLoaderTranslations(ns: string | null = null) {
  const data = useLoaderData();
  // We know more than Typescript here:
  // This _will_ produce the right result when passed a null
  return useTranslationsBase(data.tsi18n, ns as string);
}
