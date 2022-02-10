import { isSerializedPluginData, SerializedPluginData } from "@tsi18n/core";
import { Payload, PluginKey, InterpolateFn } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function interpolate<P extends {} = Record<string, string>>(
  templateStringsArray: TemplateStringsArray,
  ...replacementsArray: Array<
    SerializedPluginData<unknown, (param: never) => string> | string | number
  >
): SerializedPluginData<Payload, InterpolateFn<P>> {
  const templateStrings = Array.from(templateStringsArray).reverse();
  const replacements = Array.from(replacementsArray).reverse();
  const parts: Payload = [];
  let buffer = "";

  while (templateStrings.length > 0) {
    const templateString = templateStrings.pop() as string;

    const openIndex = templateString.indexOf("{");

    if (openIndex === -1) {
      buffer += templateString;

      const replacement = replacements.pop();
      if (replacement) {
        buffer += replacement;
      }

      continue;
    }

    buffer += templateString.slice(0, openIndex);

    if (templateString.charAt(openIndex + 1) === "{") {
      buffer += "{";
      templateStrings.push(templateString.slice(openIndex + 2));
      continue;
    }

    if (buffer) {
      parts.push(buffer);
      buffer = "";
    }

    const closeIndex = templateString.indexOf("}", openIndex);

    if (closeIndex === -1) {
      if (!templateString.endsWith(":")) {
        throw new Error("Unclosed parameter definition");
      }

      const parameter = templateString.slice(openIndex + 1, -1);

      const pluginData = replacements.pop();

      if (
        typeof pluginData !== "object" ||
        !isSerializedPluginData(pluginData)
      ) {
        throw new Error(
          "Only default formatters and plugins can be used as formatters"
        );
      }

      parts.push({
        r: parameter,
        ...pluginData,
      });

      const nextTemplateString = templateStrings.pop();
      if (!nextTemplateString?.startsWith("}")) {
        throw new Error("Unclosed format definition");
      }

      templateStrings.push(nextTemplateString.slice(1));
      continue;
    }

    templateStrings.push(templateString.slice(closeIndex + 1));

    const [parameter, format] = templateString
      .slice(openIndex + 1, closeIndex)
      .split(":", 2);

    if (!parameter) {
      throw new Error("Unnamed parameters are not allowed");
    }

    if (format) {
      const [, decimals] = format.split(".", 2);

      parts.push({
        r: parameter,
        d: decimals ? parseInt(decimals, 10) : undefined,
      });

      continue;
    }

    parts.push({
      r: parameter,
    });
  }

  if (buffer) {
    parts.push(buffer);
  }

  return {
    $plugin,
    p: parts,
  };
}

const $plugin: PluginKey = "@tsi18n/i";
