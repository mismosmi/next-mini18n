import { SerializedPluginData } from "./Plugin";

export interface MessagesDefinition {
  [key: string]:
    | string
    | null
    | SerializedPluginData<unknown, unknown>
    | MessagesDefinition;
}

export type Message = MessagesDefinition[keyof MessagesDefinition];

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

export type MessageValue<M extends Message> = M extends SerializedPluginData<
  unknown,
  unknown
>
  ? NonNullable<M["v"]>
  : M extends MessagesDefinition
  ? MessageValues<M>
  : M;

export type MessageValues<M extends MessagesDefinition> = {
  [key in keyof M]: MessageValue<M[key]>;
};

export type Messages<
  T extends I18nDefinition,
  N extends keyof T
> = MessageValues<T[N][keyof T[N]]>;

export type I18n<T extends I18nDefinition> = {
  [ns in GetNamespaces<T>]: Messages<T, ns>;
};
