import { loadTranslations, TranslationStore } from "./index";
import { Tsi18nPlugin } from "./Plugin";

describe("@tsi18n/core", () => {
  it("loads translations to a store", () => {
    const i18n = {
      helloWorld: {
        de: {
          hello: "Hallo",
          world: "Welt",
          emoji: null,
        },
        en: {
          hello: "Hello",
          world: "World",
          emoji: "😀",
        },
      },
    };

    const transport = loadTranslations(i18n, "de");

    const store = new TranslationStore();

    store.update(transport);

    expect(store.getNamespace("helloWorld")).toStrictEqual({
      hello: "Hallo",
      world: "Welt",
      emoji: null,
    });

    expect(store.getAll()).toStrictEqual({
      helloWorld: expect.any(Object),
    });
  });

  it("applies a simple plugin", () => {
    class TestPlugin extends Tsi18nPlugin<null, "test"> {
      static readonly pluginKey = "tsi18n-plugin-test";

      deserialize() {
        return "test" as const;
      }
    }

    const i18n = {
      pluginTest: {
        en: {
          test: {
            $plugin: "tsi18n-plugin-test",
            payload: null,
          },
        },
      },
    };

    const transport = loadTranslations(i18n, "en");

    const store = new TranslationStore();

    store.registerPlugins([TestPlugin]);

    store.update(transport);

    expect(store.getNamespace("pluginTest").test).toBe("test");
  });
});
