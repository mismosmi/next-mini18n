import {
  createCookie,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
  useParams,
} from "remix";
import i18n from "./index.i18n.server";
import { loadTranslations, useTranslations } from "@tsi18n/core";

const cookie = createCookie("tsi18n_cached", {
  sameSite: "strict",
  httpOnly: true,
});

export const loader: LoaderFunction = async ({ params, request }) => {
  const { locale } = params;
  console.log("loader");

  return {
    i18n: loadTranslations(i18n, locale as string),
  };
};

export default function Index() {
  const data = useLoaderData();
  const t = useTranslations<typeof i18n, "home">(data.i18n, "home");
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
