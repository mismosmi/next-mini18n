import { loadTranslations, TranslationStore } from "./index";

describe("@tsi18n/core", () => {
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

  it("loads translations to a store", () => {
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
});
