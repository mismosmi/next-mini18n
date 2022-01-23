import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useTranslations } from "@tsi18n/core";

function MyApp({ Component, pageProps }: AppProps) {
  console.log("render app", pageProps);
  useTranslations(pageProps.i18n);
  return <Component {...pageProps} />;
}

export default MyApp;
