import * as React from "react";
import { TranslationStore } from "./TranslationStore";

export const TranslationContext = React.createContext<TranslationStore>(
  new TranslationStore()
);
