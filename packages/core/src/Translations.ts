export type TranslationDefinition = Record<
  string,
  Record<string, Record<string, unknown>>
>;

export type TranslationInTransport<
  D extends TranslationDefinition = TranslationDefinition
> = [keyof D, [keyof D[keyof D], D[keyof D][keyof D[keyof D]]][]];

export type LocalizedTranslation<
  T extends TranslationDefinition,
  K extends string = "en"
> = T[keyof T][keyof T[keyof T]] extends T[keyof T][K]
  ? { [key in keyof T]: T[keyof T][K] }
  : never;
