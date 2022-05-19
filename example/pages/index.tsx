import mini18n from "next-mini18n";
import i18n from "i18n/en";

const { Hello, Greeting } = mini18n<typeof i18n>(
  (locale) => import(`i18n/${locale ?? "en"}`)
);

export default function LazyExample() {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div>
        <h3>A simple string:</h3>
        <Hello />
      </div>
      <div>
        <h3>Interpolation with a name:</h3>
        <Greeting name="Someone" />
      </div>

      <div>
        <h3>Using render-prop syntax:</h3>
        <Hello>
          {(hello) => <span>This site said &quot;{hello}&quot;</span>}
        </Hello>
      </div>

      <div>
        <h3>Using render-prop with interpolation:</h3>
        <Greeting name="Michel">
          {(greeting) => <div>Greeting greets &quot;{greeting}&quot;</div>}
        </Greeting>
      </div>
    </div>
  );
}
