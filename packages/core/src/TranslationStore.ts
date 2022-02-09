import { Tsi18nPlugin, isSerializedPluginData } from ".";
import { Tsi18nPluginConstructor } from "./Plugin";
import { I18nInTransport, Message } from "./types";

export class TranslationStore {
  private _locale: string | null = null;
  private _data: Record<string, Record<string, unknown>> = {};
  private _plugins: Map<string, Tsi18nPlugin<unknown, unknown>> = new Map();

  update(i18n: I18nInTransport): void {
    const [locale, namespaces] = i18n;

    if (this._locale !== locale) {
      this._locale = locale;
      this._data = Object.fromEntries(
        namespaces.map(([name, messages]) => [
          name,
          this._deserializeObject(messages) as Record<string, unknown>,
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

  registerPlugins(plugins: Tsi18nPluginConstructor<unknown, unknown>[]): void {
    for (const Plugin of plugins) {
      if (this._plugins.has(Plugin.pluginKey)) {
        continue;
      }
      this._plugins.set(Plugin.pluginKey, new Plugin());
    }
  }

  private readonly _deserializeObject = (obj: Message): unknown => {
    if (typeof obj === "string") {
      return obj;
    }

    if (typeof obj !== "object") {
      throw new Error(
        `Invalid serialized object of type "${typeof obj}": translations may only consist of strings, objects, arrays and null`
      );
    }

    if (obj === null) {
      return obj;
    }

    if (isSerializedPluginData(obj)) {
      const pluginKey = obj["$plugin"];

      const plugin = this._plugins.get(pluginKey);

      if (!plugin) {
        throw new Error(`Plugin "${pluginKey}" not found`);
      }

      const value = plugin.deserialize(
        obj,
        this._locale as string,
        this._deserializeObject
      );

      return value;
    }

    if (Array.isArray(obj)) {
      return obj.map((child) => this._deserializeObject(child));
    }

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => Object.prototype.hasOwnProperty.call(obj, key))
        .map(([key, value]) => [key, this._deserializeObject(value)])
    );
  };
}
