import i from "./index";

describe("the interpolate tag", () => {
  it("translates a simple string as a simple string", () => {
    const data = i`this is a test`;

    expect(data.p).toEqual(["this is a test"]);
  });

  it("interpolates strings", () => {
    const data = i`this is ${"a"} test`;

    expect(data.p).toEqual(["this is a test"]);
  });

  it("interpolates numbers", () => {
    const data = i`this is ${1} test`;

    expect(data.p).toEqual(["this is 1 test"]);
  });

  it("accepts parameters", () => {
    const data = i`this is a {test}`;

    expect(data.p).toEqual(["this is a ", { r: "test" }]);
  });

  it("accepts multiple parameters", () => {
    const data = i`{firstName} {lastName}`;

    expect(data.p).toEqual([{ r: "firstName" }, " ", { r: "lastName" }]);
  });

  it("parses decimal formatting", () => {
    const data = i`{withDecimals:.3}`;

    expect(data.p).toEqual([{ r: "withDecimals", d: 3 }]);
  });

  it("accepts a plugin as a formatter", () => {
    const data = i`this is a {test:${i`test`}} and some more text`;

    expect(data.p).toEqual([
      "this is a ",
      { r: "test", $plugin: "@tsi18n/i", p: ["test"] },
      " and some more text",
    ]);
  });
});
