# tsi18n and remix.run
Use the `@tsi18n/remix`-package.

## Setup
You'll need to add some lines to `app/entry.server.tsx`, specifically in
your `handleRequest`-function you'll need to run
```ts
filterRequestTranslations(responseHeaders, remixContext);
```
before calling `renderToString` and in `handleDataRequest` you'll need to
```ts
return filterDataRequestTranslations(request, response)
```
which modifies the response.

For an example see [entry.server.tsx](examples/example-remix/app/entry.server.tsx)

## Usage
As remix.run does not provide its own localization solution you'll need to
add a route parameter `$locale` that can be accessed in loaders.

```ts
// app/components/MyComponent.i18n.server.ts
const i18n = {
    myComponent: {
        en: {
            greeting: 'Hello from MyComponent'
        }
    }
}

export default i18n

// app/components/MyComponent.tsx
import i18n from "./MyComponent.i18n.server"
import { useTranslations } from "@tsi18n/remix"
export i18n

export function MyComponent() {
    const t = useTranslations<typeof i18n, "myComponent">("myComponent")

    return (<h3>{t.greeting}</h3>)
}

// app/routes/index.tsi18n.server.ts
const i18n = {
    home: {
        en: {
            greeting: 'Hello from Home'
        }
    }
}

export default i18n

// app/routes/index.tsx
import i18n from "./index.i18n.server"
import { MyComponent, i18n as myComponentI18n } from "components/MyComponent"
import { useLoaderTranslations, loadTranslations } from "@tsi18n/remix"

export const loader = async () => ({
    tsi18n: loadTranslations({ ...i18n, ...myComponentI18n }, "en")
})

export default function HomePage() {
    const t = useLoaderTranslations<typeof i18n, "home">("home")

    return (
        <main>
            <h1>{t.greeting}</h1>
            <MyComponent />
        </main>
    )
}
```
