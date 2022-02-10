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
    console.log("loop start");
    const templateString = templateStrings.pop() as string;

    console.log(templateString);
    const [fragment, rest1] = templateString.split("{", 2);

    if (fragment) {
      console.log("append", fragment);
      // first part of template string is not empty
      buffer += fragment;
    }

    if (!rest1) {
      // first template string is just a string
      // take the following replacement as a literal replacement
      const replacement = replacements.pop();
      if (replacement) {
        console.log("append replacement", replacement);
        buffer += replacement;
      }
      continue;
    }

    console.log("rest is", rest1);

    if (rest1.startsWith("{")) {
      console.log("escape");
      // double curly escapes as single curly
      buffer += "{";
      templateStrings.push(rest1.slice(1));
      continue;
    }

    // now comes a template parameter, append buffer as string
    if (buffer) {
      console.log("push buffer");
      parts.push(buffer);
      buffer = "";
    }

    const [spec, rest2] = rest1.split("}", 2);
    console.log("handle spec");

    if (rest2) {
      console.log("put back", rest2);
      // whatever comes after the template parameter goes back to the stack
      templateStrings.push(rest2);
    }

    if (!spec) {
      throw new Error("Replacement parameters must be named");
    }

    // parse spec
    const [param, formatStart] = spec.split(":");
    console.log("param is", param);

    if (!param) {
      throw new Error("Replacement parameters must be named");
    }

    if (typeof rest2 !== "undefined") {
      console.log("contained");
      // template parameter contains no replacements
      if (formatStart) {
        // formatting specified
        const [, decimals] = formatStart.split(".");

        parts.push({
          p: param,
          d: decimals ? parseInt(decimals, 10) : undefined,
        });

        continue;
      }

      // no formatting specified
      parts.push({
        p: param,
      });

      continue;
    }

    console.log("not contained");

    // template parameter contains a replacement
    const formatReplacement = replacements.pop();

    // get the rest of the template parameter from the following template string
    const nextTemplateString = templateStrings.pop();

    console.log("rest is", formatReplacement, nextTemplateString);

    if (!nextTemplateString) {
      throw new Error("Unclosed replacemenet parameter");
    }

    // find end of template parameter
    const [formatEnd, nextRest] = nextTemplateString.split("}");

    if (nextRest) {
      // rest of the following template string goes back to stack
      templateStrings.push(nextRest);
    }

    if (typeof formatStart === "undefined") {
      throw new Error(
        "Replacements may only be used within formatting options"
      );
    }

    switch (typeof formatReplacement) {
      case "object": {
        // this is a nested plugin

        if (!isSerializedPluginData(formatReplacement)) {
          throw new Error(
            "Only strings, numbers and other plugins may be used as formatters"
          );
        }

        if (formatStart !== "" || formatEnd !== "") {
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
          formatStart + formatReplacement + (formatEnd as string);

        const [, decimals] = completeFormatString.split(".");

        parts.push({
          p: param,
          d: decimals ? parseInt(decimals, 10) : undefined,
        });

        break;
      }

      case "number": {
        if (formatStart !== "." || formatEnd !== "") {
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
