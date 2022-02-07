import type { SerializedPluginData, Tsi18nPlugin } from "@tsi18n/core";
import { Payload, PluginKey, Value } from "../types";

export class Tsi18nInterpolatePlugin implements Tsi18nPlugin<Payload, Value> {
  readonly pluginKey: PluginKey = "@tsi18n/i";

  deserialize(serializedData: SerializedPluginData<Payload, Value>): Value {
    return (params) => {
      return serializedData.payload.replace(
        Tsi18nInterpolatePlugin.pattern,
        (match) => {
          const [name] = match.slice(1, -1).split(":") as [
            string,
            string | undefined
          ];

          const replacement = params[name];

          if (!replacement) {
            throw new Error(`Missing Parameter "${name}"`);
          }

          return replacement;
        }
      );
    };
  }

  private static readonly pattern = /\{[a-zA-Z0-9:.]+\}/g;
}
