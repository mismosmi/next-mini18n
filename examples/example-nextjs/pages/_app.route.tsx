import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useLoadedTranslations, usePlugins } from "@tsi18n/next";
import InterpolatePlugin from "@tsi18n/interpolate/plugin";

function MyApp({ Component, pageProps }: AppProps) {
  usePlugins(InterpolatePlugin);
  useLoadedTranslations(pageProps.tsi18n);
  return <Component {...pageProps} />;
}

export default MyApp;
