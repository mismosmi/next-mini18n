# next-mini18n

This has nothing to do with the package "mini18n" on npm.

## A minimal, type-safe internationalization library for Next.js

### Goals
* Minimal wire transfer: Don't send all translations on each page load.
* Modular: Add only the functionality you need.
* Type-Safety: Use typescript for code completion when accessing translations
and refactor with ease.
* Bundle size: Keep the client side bundle small.
* Framework integration: This is built for nextjs
* Minimalism: Keep the API surface small.

### Non-goals
* Batteries included: This library is not intended to do much on its own.
* Other Frameworks: This is meant for react and nextjs.
* Cleverness: This is supposed to stay simple and predictable.

## Usage
* Define translations in separate files next to your components:
```ts
// i18n/en.ts
const en = {
    Hello: 'Hello',
    World: 'World',
}
export default en
```

* Lazy-load the translation files
```ts
// pages/index.tsx
import mini18n from "next-mini18n"
// this is imported just for the typing
// and won't be included in the bundle
import en from "i18n/en"

const { Hello, World } = mini18n<typeof en>((locale) => import(`i18n/${locale}`))
```

* Use them in your component:
```ts
export default function HomePage() {
    return <h3><Hello /> <World /></h3>
}
```
## What's cool about this?
* It uses next/dynamic under the hood and therefore causes no trouble with SSR.
* It needs very little client side code
* You get nice completions when writing components
* You get type errors when removing or renaming translations that are used somewhere
* Interpolations are just functions
* Translations can be arbitrary react components

## What's less cool about this
* It uses next/dynamic under the hood and therefore loads translations lazily _after_ the first render cycle.


## Features
* Simple Translations
```ts
const en = {
    Hello: "Hello World"
}
```
* Interpolation
```ts
const en = {
    Greeting: (props: { name: string }) => `Hello, ${props.name}`
}
```
* JSX
```tsx
const en = {
    Greeting: (props: { name: string }) => <span>Hello, <b>{props.name}</b></span>
}
```
* Render Prop support
```tsx
<Hello>{(hello) => <span>In {locale} Hello means {hello}</span>}</Hello>
```

## Examples
There's an example in the [example-folder](https://github.com/mismosmi/tsi18n/tree/main/example).