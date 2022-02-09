import { SerializedPluginData } from "@tsi18n/core";

export type PluginKey = "@tsi18n/i";

type Replacement = { p: string };
type NumberReplacement = Replacement & { d?: number };
type PluginReplacement = Replacement &
  SerializedPluginData<unknown, (param: unknown) => string>;

export type Payload = Array<
  string | Replacement | NumberReplacement | PluginReplacement
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type InterpolateFn<P extends {} = Record<string, string>> = (
  params: P
) => string;
