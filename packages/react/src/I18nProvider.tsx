import { I18nInTransport } from "@tsi18n/core";
import * as React from "react";
import { TranslationContext } from "./TranslationContext";

export function I18nProvider(
  props: React.PropsWithChildren<{ i18n: I18nInTransport }>
) {
  const store = React.useContext(TranslationContext);
  store.update(props.i18n);

  return props.children;
}
