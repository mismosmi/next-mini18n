import {
  isSerializedPluginData,
  SerializedPluginData,
  Tsi18nPlugin,
} from "@tsi18n/core";
import { Payload, PluginKey, InterpolateFn } from "../types";

export default class Tsi18nInterpolatePlugin extends Tsi18nPlugin<
  Payload,
  InterpolateFn
> {
  static readonly pluginKey: PluginKey = "@tsi18n/i";

  deserialize(
    serializedData: SerializedPluginData<Payload, InterpolateFn>,
    locale: string,
    deserializeObject: (
      serializedData: SerializedPluginData<unknown, (param: unknown) => string>
    ) => (param: unknown) => string
  ): InterpolateFn {
    return (params) => {
      return serializedData.payload
        .map((part) => {
          switch (typeof part) {
            case "string":
              return part;
            case "object": {
              const value = params[part.p];

              if (typeof value === "undefined") {
                throw new Error(`Missing parameter "${part.p}"`);
              }

              if (isSerializedPluginData(part)) {
                const formatter = deserializeObject(part);

                return formatter(value);
              }

              if ("d" in part) {
                return parseFloat(value).toFixed(part.d);
              }

              return value;
            }
          }
        })
        .join("");
    };
  }
}
