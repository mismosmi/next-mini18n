import { SerializedPluginData } from "./Plugin";

export type Message = string | null | SerializedPluginData<unknown, unknown>;

export interface MessagesDefinition {
  [key: string]: Message | MessagesDefinition;
}

export type NamespaceDefinition = Record<string, MessagesDefinition>;

export type I18nDefinition = Record<string, NamespaceDefinition>;

type GetLocales<T extends I18nDefinition> = keyof T[keyof T];

type GetNamespaces<T extends I18nDefinition> = keyof T;

export type GetMessages<T extends I18nDefinition> =
  T[GetNamespaces<T>][GetLocales<T>];

export type I18nInTransport<T extends I18nDefinition = I18nDefinition> = [
  GetLocales<T>,
  [GetNamespaces<T>, GetMessages<T>][]
];

type MessageValues<M extends MessagesDefinition> = {
  [key in keyof M]: M[key] extends SerializedPluginData<unknown, unknown>
    ? M[key]["value"]
    : M[key] extends Record<string, MessagesDefinition>
    ? MessageValues<M[key]>
    : M;
};

export type Messages<
  T extends I18nDefinition,
  N extends keyof T
> = MessageValues<T[N][keyof T[N]]>;

export type I18n<T extends I18nDefinition> = {
  [ns in GetNamespaces<T>]: Messages<T, ns>;
};
