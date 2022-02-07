import { deserialize } from ".";
import { I18nInTransport } from "./types";

export class TranslationStore {
  private _locale: string | null = null;
  private _deserializeObject: ((obj: unknown) => unknown) | null = null;
  private _data: Record<string, Record<string, unknown>> = {};

  constructor(private readonly _key: string = "tsi18n_cached") {}

  update(i18n: I18nInTransport): void {
    const [locale, namespaces] = i18n;

    if (this._locale !== locale) {
      this._locale = locale;
      this._deserializeObject = deserialize(locale);
      this._data = Object.fromEntries(
        namespaces.map(([name, messages]) => [
          name,
          this._deserializeObject(messages),
        ])
      );
      return;
    }

    for (const [ns, translations] of namespaces) {
      if (!(ns in this._data)) {
        this._data[ns] = translations;
      }
    }
  }

  getNamespace(ns: string): Record<string, unknown> {
    const translations = this._data[ns];

    if (typeof translations === "undefined") {
      throw new Error(
        `Missing translations for namespace "${ns}" and locale "${this._locale}"`
      );
    }

    return translations;
  }

  getAll(): Record<string, Record<string, unknown>> {
    return this._data;
  }
}
