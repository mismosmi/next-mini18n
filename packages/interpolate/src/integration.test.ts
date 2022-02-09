import { loadTranslations, TranslationStore, Messages } from "@tsi18n/core";
import i from "./index";
import InterpolatePlugin from "./plugin";

describe("@tsi18n/interpolate", () => {
  const store = new TranslationStore();

  store.registerPlugins([InterpolatePlugin]);
  it("interpolates a simple greeting", () => {
    const i18n = {
      greeting: {
        en: {
          hello: i`Hello, {name}`,
        },
      },
    };

    const transport = loadTranslations(i18n, "en");

    store.update(transport);

    const t = store.getNamespace("greeting") as Messages<
      typeof i18n,
      "greeting"
    >;

    expect(typeof t.hello).toBe("function");
    expect(t.hello({ name: "Michel" })).toBe("Hello, Michel");
  });

  it("can handle nested interpolation", () => {
    const interpolateName = i`{first} {last}`;
    const i18n = {
      greeting: {
        en: {
          hello: i<{
            name: {
              first: string;
              last: string;
            };
          }>`Hello, {name:${interpolateName}}`,
        },
      },
    };

    const transport = loadTranslations(i18n, "en");

    const [
      ,
      [
        [
          ,
          {
            hello: {
              payload: [, name],
            },
          },
        ],
      ],
    ] = transport;

    console.log(name);

    expect(name).toStrictEqual({
      p: "name",
      $plugin: "@tsi18n/i",
      payload: [{ p: "first" }, " ", { p: "last" }],
    });

    store.update(transport);

    const t = store.getNamespace("greeting") as Messages<
      typeof i18n,
      "greeting"
    >;

    expect(t.hello({ name: { first: "Testo", last: "Tester" } })).toBe(
      "Hello, Testo Tester"
    );
  });
});
