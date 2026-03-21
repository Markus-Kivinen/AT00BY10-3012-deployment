/**
 * Tests related to string manipulation functions such as camelCase, capitalize, endsWith, and upperFirst.
 */

import { describe, test } from "node:test";
import assert from "assert";
import camelCase from "../src/camelCase.js";
import capitalize from "../src/capitalize.js";
import endsWith from "../src/endsWith.js";
import upperFirst from "../src/upperFirst.js";

describe("Tekstinkäsittely", () => {
  describe("camelCase", () => {
    test("Muuttaa merkkijonon kameliksi", () => {
      const result = camelCase("hello world");
      assert.strictEqual(result, "helloWorld");
    });
  });

  describe("upperfirst", () => {
    test("Muuttaa merkkijonon ensimmäisen kirjaimen isoksi", () => {
      const result = upperFirst("hello world");
      assert.strictEqual(result, "Hello world");
    });
    test("Ei tee mitään jos merkkijono on tyhjä", () => {
      const result = upperFirst("");
      assert.strictEqual(result, "");
    });
    test("Ei kaadu väärällä tyypillä", () => {
      const result = upperFirst(123);
      assert.strictEqual(result, "123");
    });
  });

  describe("capitalize", () => {
    test("Muuttaa merkkijonon ensimmäisen kirjaimen suureksi", () => {
      const result = capitalize("hello world");
      assert.strictEqual(result, "Hello world");
    });
    test("Ei tee mitään jos merkkijono on tyhjä", () => {
      const result = capitalize("");
      assert.strictEqual(result, "");
    });
    test("Ei kaadu väärällä tyypillä", () => {
      const result = capitalize(123);
      assert.strictEqual(result, "123");
    });
  });

  describe("endsWith", () => {
    test("Tarkistaa että merkkijono päättyy annettuun merkkijonoon", () => {
      const result = endsWith("hello world", "world");
      assert.strictEqual(result, true);
    });
    test("rajoittaa indeksin", () => {
      // Position is clamped to [0, string.length] before comparison.
      let result = endsWith("hello world", "world", -1);
      assert.strictEqual(result, false);

      result = endsWith("hello world", "world", 100);
      assert.strictEqual(result, true);
    });

    test("Tarkistaa että merkkijono päättyy annettuun merkkijonoon halutussa positiossa", () => {
      let result = endsWith("hello world", "world", 11);
      assert.strictEqual(result, true);

      result = endsWith("hello world", "o w", 7);
      assert.strictEqual(result, true);
    });
    test("Tarkistaa että merkkijono ei pääty annettuun merkkijonoon", () => {
      const result = endsWith("hello world", "hello");
      assert.strictEqual(result, false);
    });
  });
});
