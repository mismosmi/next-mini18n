export type PluginKey = "@tsi18n/i";

export type Payload = string;

// eslint-disable-next-line @typescript-eslint/ban-types
export type InterpolateFn<P extends {} = Record<string, string>> = (
  params: P
) => string;
