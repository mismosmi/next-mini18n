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
