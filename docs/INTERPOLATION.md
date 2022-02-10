# Interpolation

The most basic feature of any i18n-library is interpolation.

There's still a lot of projects that literally never need it so it's optional
and implemented as a plugin in tsi18n.

To use it, add the plugin via `usePlugins`:
```tsx
import InterpolationPlugin from "@tsi18n/interpolate/plugin"
import { usePlugins } from "@tsi18n/react" // no framework
import { usePlugins } from "@tsi18n/next" // NextJS
import { usePlugins } from "@tsi18n/remix" // remix.run


function App() {
    usePlugins(InterpolationPlugin)

    return (...)
}
```

In the translation files use
```ts
import i from "@tsi18n/interpolate";

const i18n = {
    home: {
        en: {
            greeting: i`Hello, {name}`,
        },
    },
}

export default i18n
```

And in components use it as
```tsx
function HomePage() {
    const t = useTranslations<typeof i18n, "home">("home")

    return (
        <h3>{t.greeting({ name: "John Doe" })}</h3>
    )
}
```

## Nesting
The interpolation plugin can handle nested plugins as a formatter for a specific
parameter. For example:
```ts
greeting: i<{ name: { first: string; last: string } }>`Hello, {name:${i`{first} {last}`}}`
```
can be used as
```ts
t.greeting({ name: { first: 'John', last: 'Doe' } })
```

## Number formatting
Currently, the interpolation plugin natively supports only the number of decimal
places as a format parameter:
```ts
// definition:
announcement: i`The score is {score:.3}`

// usage:
t.announcement({ score: 1.2345678 })

// result:
The score is 1.234
```
