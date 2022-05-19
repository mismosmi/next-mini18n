/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

type TranslationDefinition = string | React.ComponentType<any>;

type TranslationProps<T extends TranslationDefinition> =
  T extends React.JSXElementConstructor<infer P> ? P : {};

type TranslationComponent<T extends TranslationDefinition> = React.ElementType<
  TranslationProps<T>
>;

type Translations<T extends Record<string, TranslationDefinition>> = {
  readonly [key in keyof T]: TranslationComponent<T[key]>;
};

const defaultLocale = Symbol();

export default function tsi18n<T extends Record<string, TranslationDefinition>>(
  loader: (locale?: string) => Promise<T | { default: T }>
): Translations<T> {
  const proxy = new Proxy(
    new Map<string | symbol, Map<string | symbol, React.ElementType>>(),
    {
      get(target, property) {
        return function Translation(props: {}) {
          const { locale } = useRouter();

          let localeCache = target.get(locale ?? defaultLocale);

          if (!localeCache) {
            localeCache = new Map();
            target.set(locale ?? defaultLocale, localeCache);
          }

          let TranslationComponent = localeCache.get(property);

          if (TranslationComponent) {
            return React.createElement(TranslationComponent, props);
          }

          TranslationComponent = dynamic(async function loadTranslation() {
            let module = await loader(locale);

            if ("default" in module) {
              module = module.default as T;
            }

            const translationDefinition = module[property as keyof T];

            if (typeof translationDefinition === "string") {
              return () =>
                React.createElement(React.Fragment, {}, translationDefinition);
            }

            return translationDefinition as React.ComponentType;
          });

          localeCache.set(locale ?? defaultLocale, TranslationComponent);

          return React.createElement(TranslationComponent, props);
        };
      },
    }
  );

  return proxy as unknown as Translations<T>;
}
