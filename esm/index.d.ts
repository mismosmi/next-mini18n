import React from "react";
declare type TranslationDefinition = string | React.ComponentType<any> | ((props: any) => string);
declare type TranslationProps<T extends TranslationDefinition> = T extends React.JSXElementConstructor<infer P> ? P : T extends (props: any) => string ? Parameters<T>[0] : {};
declare type TranslationComponent<T extends TranslationDefinition> = T extends string ? React.ComponentType<{
    children?: (value: string) => JSX.Element;
}> : React.ComponentType<TranslationProps<T> & {
    children?: (value: React.ReactNode) => JSX.Element;
}>;
declare type Translations<T extends Record<string, TranslationDefinition>> = {
    readonly [key in keyof T]: TranslationComponent<T[key]>;
};
export default function tsi18n<T extends Record<string, TranslationDefinition>>(loader: (locale?: string) => Promise<T | {
    default: T;
}>): Translations<T>;
export {};
//# sourceMappingURL=index.d.ts.map