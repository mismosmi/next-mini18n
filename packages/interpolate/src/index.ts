import { isSerializedPluginData, SerializedPluginData } from "@tsi18n/core";
import { Payload, PluginKey, InterpolateFn } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function interpolate<P extends {} = Record<string, string>>(
  templateStringsArray: TemplateStringsArray,
  ...replacementsArray: Array<
    SerializedPluginData<unknown, (param: unknown) => string> | string | number
  >
): SerializedPluginData<Payload, InterpolateFn<P>> {
  const templateStrings = Array.from(templateStringsArray).reverse();
  const replacements = Array.from(replacementsArray).reverse();
  const parts: Payload = [];

  while (templateStrings.length > 0) {
    const templateString = templateStrings.pop() as string;

    const [fragment, temp] = templateString.split("{", 2);

    if (fragment) {
      parts.push(fragment);
    }

    if (!temp) {
      const replacement = replacements.pop();
      if (replacement) {
        parts.push(replacement.toString());
      }
      continue;
    }

    const [spec, rest] = temp.split("}", 2);

    if (rest) {
      templateStrings.push(rest);
    }

    if (!spec) {
      throw new Error("Replacement parameters must be named");
    }

    const [param, format] = spec.split(":");

    if (!param) {
      throw new Error("Replacement parameters must be named");
    }

    if (typeof rest !== "undefined") {
      if (format) {
        const [, decimals] = format.split(".");

        parts.push({
          p: param,
          d: decimals ? parseInt(decimals, 10) : undefined,
        });

        continue;
      }

      parts.push({
        p: param,
      });

      continue;
    }

    const formatReplacement = replacements.pop();

    const nextTemplateString = templateStrings.pop();

    if (!nextTemplateString) {
      throw new Error("Unclosed replacemenet parameter");
    }

    const [formatEnd, nextRest] = nextTemplateString.split("}");

    if (nextRest) {
      templateStrings.push(nextRest);
    }

    switch (typeof formatReplacement) {
      case "object": {
        if (!isSerializedPluginData(formatReplacement)) {
          throw new Error(
            "Only strings, numbers and other plugins may be used as formatters"
          );
        }

        if (format || formatEnd) {
          throw new Error(
            "Plugin formatters may not be combined with other formatting options"
          );
        }

        parts.push({
          ...formatReplacement,
          p: param,
        });

        break;
      }

      case "string": {
        const completeFormatString =
          (format ?? "") + formatReplacement + (formatEnd ?? "");

        const [, decimals] = completeFormatString.split(".");

        parts.push({
          p: param,
          d: decimals ? parseInt(decimals, 10) : undefined,
        });

        break;
      }

      case "number": {
        if (format !== "." || formatEnd !== "") {
          throw new Error(
            "Numbers can only be used in formatters to specify decimal places"
          );
        }

        parts.push({
          p: param,
          d: formatReplacement,
        });

        break;
      }
    }
  }

  return {
    $plugin,
    payload: parts,
  };
}

const $plugin: PluginKey = "@tsi18n/i";
