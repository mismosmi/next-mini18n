import { TranslationStore } from "@tsi18n/core";
import * as React from "react";
import { TranslationContext } from "./TranslationContext";

export function I18nBoundary(props: React.PropsWithChildren<{}>) {
  const store = React.useMemo(() => new TranslationStore(), []);

  return (
    <TranslationContext.Provider value={store}>
      {props.children}
    </TranslationContext.Provider>
  );
}
