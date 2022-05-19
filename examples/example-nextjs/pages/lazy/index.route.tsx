import tsi18n from "@tsi18n/lazy";
import i18n from "./en";

const { Hello, Greeting } = tsi18n<typeof i18n>(
  (locale) => import(`./${locale ?? "en"}`)
);

export default function LazyExample() {
  return (
    <div>
      <Hello />
      <Greeting name="Michel" />
    </div>
  );
}
