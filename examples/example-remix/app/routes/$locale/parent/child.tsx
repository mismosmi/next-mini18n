import { Link, LoaderFunction, useParams } from "remix";
import commonI18n from "../common.i18n.server";
import childI18n from "./child.i18n.server";
import { loadTranslations, useLoaderTranslations } from "@tsi18n/remix";

export const loader: LoaderFunction = async ({ params }) => {
  const { locale } = params;

  return {
    tsi18n: loadTranslations(
      {
        ...commonI18n,
        ...childI18n,
      },
      locale as string
    ),
  };
};

export default function Child() {
  const t = useLoaderTranslations<typeof commonI18n & typeof childI18n>();
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
