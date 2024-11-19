import { stringify } from "../../src/render";

describe("Convert data type to render prop string", function () {
  it("should stringify number", () => {
    const input = 2;
    const result = stringify(input);
    expect(result).toBe("2");
  });

  it("should throw an error when strinfying BigInt", () => {
    const input = 27n;
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should throw an error when strinfying Date", () => {
    const input = new Date();
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should throw an error when strinfying regular expressions", () => {
    const input =
      /\s*\$trigger\s*\(\s*([^,]+)\s*(?:,\s*([^,]+)\s*)?(?:,\s*{\s*([^{}$]+)\s*}\s*)?\s*\)/g;
      console.error = jest.fn();
      stringify(input);
      expect(console.error).toHaveBeenCalled();
  });

  it("should stringify undefined", () => {
    const input = undefined;
    const result = stringify(input);
    expect(result).toBe("undefined");
  });

  it("should correctly serialize a plain object", () => {
    const input = { key: "value" };
    const result = stringify(input);
    expect(result).toBe(
      "_9s35Ufa7M67wghwT_{&quot;key&quot;:&quot;value&quot;}_9s35Ufa7M67wghwT_"
    );
  });

  it("should throw an error when strinfying Map", () => {
    const input = new Map();
    input.set(1);
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should throw an error when strinfying WeakMap", () => {
    const input = new WeakMap();
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should throw an error when strinfying Set", () => {
    const input = new Set([1, 3]);
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should throw an error when strinfying WeakSet", () => {
    const input = new WeakSet();
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should correctly serialize a function", () => {
    const input = () => new Set([1, 3]);
    const result = stringify(input);
    expect(result).toBe(
      "_9s35Ufa7M67wghwT___function__:function input() {      return new Set([1, 3]);    }_9s35Ufa7M67wghwT_"
    );
  });

  it("should handle empty objects", () => {
    const input = {};
    const result = stringify(input);
    expect(result).toBe("_9s35Ufa7M67wghwT_{}_9s35Ufa7M67wghwT_");
  });

  it("should correctly serialize a string", () => {
    const input = "$render is the best JavaScript framework in the world";
    const result = stringify(input);
    expect(result).toBe(input);
  });

  it("should throw an error when strinfying Symbol", () => {
    const input = Symbol.for("greatest");
    console.error = jest.fn();
    stringify(input);
    expect(console.error).toHaveBeenCalled();
  });

  it("should correctly handle nested arrays", () => {
    const input = [{ key: ["value1", "value2"] }];
    const result = stringify(input);
    expect(result).toBe(
      "_9s35Ufa7M67wghwT_[{&quot;key&quot;:[&quot;value1&quot;,&quot;value2&quot;]}]_9s35Ufa7M67wghwT_"
    );
  });

  it("should correctly serialize an array of objects", () => {
    const input = [{ key: "value" }, { key: "another value" }];
    const result = stringify(input);
    expect(result).toBe(
      "_9s35Ufa7M67wghwT_[{&quot;key&quot;:&quot;value&quot;},{&quot;key&quot;:&quot;another value&quot;}]_9s35Ufa7M67wghwT_"
    );
  });
});
