import { Outlet, Link, LoaderFunction, useParams, useLoaderData } from "remix";
import commonI18n from "../common.i18n.server";
import childI18n from "./child.i18n.server";
import { loadTranslations, useTranslations } from "@tsi18n/core";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { locale } = params;

  return {
    i18n: loadTranslations(
      {
        ...commonI18n,
        ...childI18n,
      },
      locale as string
    ),
  };
};

export default function Child() {
  const data = useLoaderData();
  const t = useTranslations<typeof commonI18n & typeof childI18n>(data.i18n);
  const params = useParams();

  return (
    <div>
      <h1>{t.common.content}</h1>
      <h3>{t.child.content}</h3>

      <p>
        <Link to={`/${params.locale}`}>Home</Link>
      </p>
    </div>
  );
}
