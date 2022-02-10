# tsi18n

## A minimal, modular and type-safe internationalization library

### Goals
* Minimal wire transfer: Don't send all translations on each page load.
* Modular: Add only the functionality you need.
* Composable: Combine plugins to get the most out of them.
* Type-Safety: Use typescript for code completion when accessing translations
and refactor with ease.
* Bundle size: Keep the client side bundle small, do as much as possible on the
server and during build steps.
* Framework integration: This should work well with nextjs and remix.run
* Minimalism: Keep the API surface small.

### Non-goals
* Batteries included: This library is not intended to do much on its own.
* Other UI Frameworks: This is meant for react.
* Cleverness: This is supposed to stay simple and predictable.

## Usage
* Define translations in separate files next to your components:
```ts
const i18n = {
    home: {
        en: {
            hello: 'Hello',
            world: 'World',
        },
        de: {
            hello: 'Hallo',
            welt: 'Welt',
        },
    },
}
export default i18n
```

* Make your framework pass them to the client
```ts
// NextJS
import { loadTranslations } from "@tsi18n/next"

export const getServerSideProps = async (cx) => ({
    props: {
        tsi18n: loadTranslations(i18n, cx),
    }
})
```
```ts
// remix.run
import { loadTranslations } from "@tsi18n/remix"

export const loader = async ({ params }) => ({
    tsi18n: loadTranslations(i18n, params.locale as string),
})
```

* Use them in your component:
```ts
export default function HomePage() {
    const t = useTranslations<typeof i18n, "home">("home");

    return <h3>{t.hello} {t.world}</h3>
}
```
(Remix-routes will need to use `useLoaderTranslations` instead of `useTranslations`)

## What's cool about this?
* It sets a session cookie with the translations you've already loaded and shakes
those from the server responses transmitting only translations you haven't
loaded yet on each request. I hope that's somewhat efficient. The filtering
does not and can not work with `getStaticProps`.
* It needs very little client side code (and very little on the server side as well)
* You get nice completions when writing components
* You get type errors when removing or renaming translations that are used somewhere

## Examples
Well, take a look in the examples-folder. There's one with NextJS and one with remix.run

## Docs
* [Interpolation](docs/INTERPOLATION.md)
* [remix.run](docs/REMIX.md)
* [plugins](docs/PLUGIN.md)
