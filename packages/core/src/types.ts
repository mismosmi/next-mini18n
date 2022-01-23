export type Message = string | null;

export interface MessagesDefinition {
  [key: string]:
    | Message
    | Record<string, MessagesDefinition>
    | Array<MessagesDefinition>;
}

export type NamespaceDefinition = Record<string, MessagesDefinition>;

export type I18nDefinition = Record<string, NamespaceDefinition>;

type GetLocales<T extends I18nDefinition> = keyof T[keyof T];

type GetNamespaces<T extends I18nDefinition> = keyof T;

type GetMessages<T extends I18nDefinition> = T[GetNamespaces<T>][GetLocales<T>];

export type I18nInTransport<T extends I18nDefinition = I18nDefinition> = [
  GetLocales<T>,
  [GetNamespaces<T>, GetMessages<T>][]
];

export type I18n<T extends I18nDefinition> = {
  [ns in GetNamespaces<T>]: T[ns][keyof T[ns]];
};

export type Messages<
  T extends I18nDefinition,
  N extends keyof T
> = T[N][keyof T[N]];
