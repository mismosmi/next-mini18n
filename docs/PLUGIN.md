# Plugins

... are fairly easy to write. They each consist of a serialization and a
deserialization layer.

## Serialization
Happens through a function that can be used in i18n definitions. For
interpolations this is a tagged template literal but it can be any function
that accepts any inputs and returns a `SerializedPluginData` object.

`SerializedPluginData` is an object with three fields:
* `$plugin` is a unique key for the plugin that is used to figure out how to
deserialize the data on the client
* `p` is the payload. Whatever data your plugin needs to transfer to the client.
* `v` is always undefined and only there for the type parameter.

`SerializedPluginData` also has two type parameters: `P` as in Payload and
`V` as in Value. Your `SerializedPluginData` _must_ deserialize to something
of type `V`.

## Deserialization
For the deserialization step, create a class that extends `Tsi18nPlugin` from
`@tsi18n/core`.

The `deserialize`-method should turn your `SerializedPluginData<P, V>` into
something of type `V`.

Besides the first argument, `serializedData`, it also receives the current
locale and the `deserializeObject` method which can be used to deserialize
nested plugin data. This is useful to make plugins composable.
