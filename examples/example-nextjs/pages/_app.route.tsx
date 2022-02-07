import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useLoadedTranslations } from "@tsi18n/next";

function MyApp({ Component, pageProps }: AppProps) {
  useLoadedTranslations(pageProps.tsi18n);
  return <Component {...pageProps} />;
}

export default MyApp;
