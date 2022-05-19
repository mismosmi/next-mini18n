/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
const defaultLocale = Symbol();
export default function tsi18n(loader) {
    const proxy = new Proxy(new Map(), {
        get(target, property) {
            return function Translation(props) {
                const { locale } = useRouter();
                let localeCache = target.get(locale !== null && locale !== void 0 ? locale : defaultLocale);
                if (!localeCache) {
                    localeCache = new Map();
                    target.set(locale !== null && locale !== void 0 ? locale : defaultLocale, localeCache);
                }
                let TranslationComponent = localeCache.get(property);
                if (TranslationComponent) {
                    return React.createElement(TranslationComponent, props);
                }
                TranslationComponent = dynamic(async function loadTranslation() {
                    let module = await loader(locale);
                    if ("default" in module) {
                        module = module.default;
                    }
                    const translationDefinition = module[property];
                    if (typeof translationDefinition === "undefined") {
                        throw new Error(`Translation "${String(property)}" for locale "${locale}" not found.`);
                    }
                    const render = props.children;
                    if (typeof translationDefinition === "string") {
                        if (typeof render === "function") {
                            return () => render(translationDefinition);
                        }
                        return () => React.createElement(React.Fragment, {}, translationDefinition);
                    }
                    if (typeof render === "function") {
                        if (typeof translationDefinition === "function") {
                            return (props) => {
                                const children = translationDefinition(props);
                                return render(children);
                            };
                        }
                        return class Translation extends translationDefinition {
                            render() {
                                const children = super.render();
                                return render(children);
                            }
                        };
                    }
                    return translationDefinition;
                });
                localeCache.set(locale !== null && locale !== void 0 ? locale : defaultLocale, TranslationComponent);
                return React.createElement(TranslationComponent, props);
            };
        },
    });
    return proxy;
}
//# sourceMappingURL=index.js.map