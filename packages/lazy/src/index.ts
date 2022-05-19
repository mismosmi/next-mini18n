/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

type TranslationDefinition =
  | string
  | React.ComponentType<any>
  | ((props: any) => string);

type TranslationProps<T extends TranslationDefinition> =
  T extends React.JSXElementConstructor<infer P>
    ? P
    : T extends (props: any) => string
    ? Parameters<T>[0]
    : {};

type TranslationComponent<T extends TranslationDefinition> = T extends string
  ? React.ComponentType<{ children?: (value: string) => JSX.Element }>
  : React.ComponentType<
      TranslationProps<T> & {
        children?: (value: React.ReactNode) => JSX.Element;
      }
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
        return function Translation(props: {
          children?: (value: TranslationDefinition) => JSX.Element;
        }) {
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

            if (typeof translationDefinition === "undefined") {
              throw new Error(
                `Translation "${String(
                  property
                )}" for locale "${locale}" not found.`
              );
            }

            const render = props.children;

            if (typeof translationDefinition === "string") {
              if (typeof render === "function") {
                return () => render(translationDefinition);
              }

              return () =>
                React.createElement(React.Fragment, {}, translationDefinition);
            }

            if (typeof render === "function") {
              if (typeof translationDefinition === "function") {
                return (props) => {
                  const children = (translationDefinition as any)(props);
                  return render(children);
                };
              }

              return class Translation extends (translationDefinition as any) {
                render() {
                  const children = super.render();
                  return render(children);
                }
              } as unknown as React.ComponentClass;
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
