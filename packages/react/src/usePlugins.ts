import { Tsi18nPluginConstructor } from "@tsi18n/core";
import * as React from "react";
import { TranslationContext } from "./TranslationContext";

export function usePlugins(
  ...plugins: Array<Tsi18nPluginConstructor<unknown, unknown>>
): void {
  const cx = React.useContext(TranslationContext);

  cx.registerPlugins(plugins);
}
