import { SerializedPluginData } from "@tsi18n/core";
import { Payload, PluginKey, InterpolateFn } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function interpolate<P extends {} = Record<string, string>>(
  strings: TemplateStringsArray
): SerializedPluginData<Payload, InterpolateFn<P>> {
  return {
    $plugin,
    payload: strings.join(""),
  };
}

const $plugin: PluginKey = "@tsi18n/i";
