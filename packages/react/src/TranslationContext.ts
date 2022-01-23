import * as React from "react";
import { TranslationStore } from "@tsi18n/core";

export const TranslationContext = React.createContext<TranslationStore>(
  new TranslationStore()
);
