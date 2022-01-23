import { Outlet, LoaderFunction } from "remix";
import commonI18n from "./common.i18n.server";
import { loadTranslations, useLoaderTranslations } from "@tsi18n/remix";

export const loader: LoaderFunction = async ({ params }) => {
  const { locale } = params;

  return {
    tsi18n: loadTranslations(commonI18n, locale as string),
  };
};

export default function Parent() {
  const t = useLoaderTranslations<typeof commonI18n>();

  return (
    <div>
      <h1>{t.common.content}</h1>

      <div style={{ paddingLeft: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
