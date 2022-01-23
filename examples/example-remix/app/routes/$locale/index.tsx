import { Link, LoaderFunction, useParams } from "remix";
import i18n from "./index.i18n.server";
import { loadTranslations, useLoaderTranslations } from "@tsi18n/remix";

export const loader: LoaderFunction = async ({ params }) => {
  const { locale } = params;

  return {
    tsi18n: loadTranslations(i18n, locale as string),
  };
};

export default function Index() {
  const t = useLoaderTranslations<typeof i18n, "home">("home");
  const params = useParams();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>
        {t.hello} {t.world}
      </h1>
      <Link to={`/${params.locale}/info`}>More Info</Link>
      <br />
      <Link to={`/${params.locale}/parent/child`}>Nested Route</Link>
    </div>
  );
}

export function ErrorBoundary() {
  return "Whoopsie Doopsie";
}
