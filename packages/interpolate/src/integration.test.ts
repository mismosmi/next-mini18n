import {
  loadTranslations,
  registerPlugins,
  TranslationStore,
  Messages,
} from "@tsi18n/core";
import i from "./index";
import InterpolatePlugin from "./plugin";

registerPlugins(new InterpolatePlugin());

describe("@tsi18n/interpolate", () => {
  it("interpolates a simple greeting", () => {
    const i18n = {
      greeting: {
        en: {
          hello: i`Hello, {name}`,
        },
      },
    };

    const store = new TranslationStore();

    store.update(loadTranslations(i18n, "en"));

    const t = store.getNamespace("greeting") as Messages<
      typeof i18n,
      "greeting"
    >;
    console.log(t.hello);
    expect(typeof t.hello).toBe("function");
    expect(t.hello({ name: "Michel" })).toBe("Hello, Michel");
  });
});
