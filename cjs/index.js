"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
const dynamic_1 = __importDefault(require("next/dynamic"));
const router_1 = require("next/router");
const react_1 = __importDefault(require("react"));
const defaultLocale = Symbol();
function tsi18n(loader) {
    const proxy = new Proxy(new Map(), {
        get(target, property) {
            return function Translation(props) {
                const { locale } = (0, router_1.useRouter)();
                let localeCache = target.get(locale !== null && locale !== void 0 ? locale : defaultLocale);
                if (!localeCache) {
                    localeCache = new Map();
                    target.set(locale !== null && locale !== void 0 ? locale : defaultLocale, localeCache);
                }
                let TranslationComponent = localeCache.get(property);
                if (TranslationComponent) {
                    return react_1.default.createElement(TranslationComponent, props);
                }
                TranslationComponent = (0, dynamic_1.default)(async function loadTranslation() {
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
                        return () => react_1.default.createElement(react_1.default.Fragment, {}, translationDefinition);
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
                return react_1.default.createElement(TranslationComponent, props);
            };
        },
    });
    return proxy;
}
exports.default = tsi18n;
//# sourceMappingURL=index.js.map