import * as React from "react";

export type PluginKey = "@tsi18n/i";

export type Payload = string;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Value<I extends {} = Record<string, string>> = (
  interpolations: I
) => React.ReactNode;
