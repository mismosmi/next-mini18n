export interface SerializedPluginData<P, V> {
  $plugin: string;
  value?: V;
  payload: P;
}

export interface Tsi18nPlugin<P, V> {
  readonly pluginKey: string;
  deserialize(serializedData: SerializedPluginData<P, V>): V;
}

const registeredPlugins = new Map<string, Tsi18nPlugin<unknown, unknown>>();

export function registerPlugins(
  ...plugins: Tsi18nPlugin<unknown, unknown>[]
): void {
  for (const plugin of plugins) {
    registeredPlugins.set(plugin.pluginKey, plugin);
  }
}

function isSerializedPluginData(
  obj: object
): obj is SerializedPluginData<unknown, unknown> {
  return "$plugin" in obj;
}

export function deserialize(locale: string) {
  function deserializeObject(obj: unknown): unknown {
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

      const plugin = registeredPlugins.get(pluginKey);

      if (!plugin) {
        throw new Error(`Plugin "${pluginKey}" not found`);
      }

      const value = plugin.deserialize(obj);

      return value;
    }

    if (Array.isArray(obj)) {
      return obj.map((child) => deserializeObject(child));
    }

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => Object.prototype.hasOwnProperty.call(obj, key))
        .map(([key, value]) => [key, deserializeObject(value)])
    );
  }

  return deserializeObject;
}
