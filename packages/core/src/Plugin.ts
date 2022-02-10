export interface SerializedPluginData<P, V> {
  $plugin: string;
  v?: V;
  p: P;
}

export abstract class Tsi18nPlugin<P, V> {
  static readonly pluginKey: string;
  abstract deserialize(
    serializedData: SerializedPluginData<P, V>,
    locale: string,
    deserializeObject: (
      serializedData: SerializedPluginData<unknown, unknown>
    ) => unknown
  ): V;
}

export interface Tsi18nPluginConstructor<P, V> {
  readonly pluginKey: string;
  new (): Tsi18nPlugin<P, V>;
}

export function isSerializedPluginData(
  obj: object
): obj is SerializedPluginData<unknown, unknown> {
  return "$plugin" in obj;
}
