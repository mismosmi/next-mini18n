import { I18nProps, loadTranslations, useTranslations } from "@tsi18n/next";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import i18n from "./info.i18n";

export const getServerSideProps: GetServerSideProps<I18nProps> = async (cx) => {
  return {
    props: {
      tsi18n: loadTranslations(i18n, cx),
    },
  };
};

const Info: NextPage = () => {
  const t = useTranslations<typeof i18n, "info">("info");
  return (
    <main>
      <h3>Info</h3>
      <p>{t.currentTime({ time: (Date.now() / 10000).toFixed(0) })}</p>
      <p>
        <Link href="/">
          <a>Go Home</a>
        </Link>
      </p>
    </main>
  );
};

export default Info;
