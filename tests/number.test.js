/**
 * Tests related to numerical functions such as add, divide, ceil, and clamp.
 *
 */

import { describe, test } from "node:test";
import assert from "assert";
import add from "../src/add.js";
import ceil from "../src/ceil.js";
import clamp from "../src/clamp.js";
import divide from "../src/divide.js";

describe("Numeeriset funktiot", () => {
  describe("add", () => {
    test("Laskee summan kahdelle luvulle", () => {
      const result = add(2, 3);
      assert.strictEqual(result, 5);
    });
    test("Laskee summan kahdelle negatiivisella luvulle", () => {
      const result = add(-2, -3);
      assert.strictEqual(result, -5);
    });
    test("Laskee summan yhdelle positiiviselle ja yhdelle negatiiviselle luvulle", () => {
      const result = add(5, -3);
      assert.strictEqual(result, 2);
    });
  });

  describe("divide", () => {
    test("Jakaa kaksi lukua", () => {
      const result = divide(6, 3);
      assert.strictEqual(result, 2);
    });
    test("Palauttaaa Infinity jakamalla nollalla", () => {
      const result = divide(6, 0);
      assert.strictEqual(result, Infinity);
    });
    test("Jakaa kaksi lukua, joissa toinen on desimaaliluku", () => {
      const result = divide(5, 2);
      assert.strictEqual(result, 2.5);
    });
    test("Jakaa kaksi negatiivista lukua", () => {
      const result = divide(-6, -3);
      assert.strictEqual(result, 2);
    });
  });

  describe("ceil", () => {
    test("Pyöristää luvun ylöspäin", () => {
      const result = ceil(4.67);
      assert.strictEqual(result, 5);
    });
    test("Pyöristää luvun ylöspäin halutulla tarkkuudella", () => {
      // Positive precision rounds decimals
      let result = ceil(5.005, 2);
      assert.strictEqual(result, 5.01);
      // negative precision rounds to powers of ten
      result = ceil(7040, -2);
      assert.strictEqual(result, 7100);
    });
  });

  describe("clamp", () => {
    test("Ei rajoita lukua turhaan", () => {
      const result = clamp(5, 1, 10);
      assert.strictEqual(result, 5);
    });
    test("Rajoittaa luvun alarajaan, jos se on pienempi kuin alaraja", () => {
      const result = clamp(-5, 0, 10);
      assert.strictEqual(result, 0);
    });
    test("Rajoittaa luvun ylärajaan, jos se on suurempi kuin yläraja", () => {
      const result = clamp(15, 0, 10);
      assert.strictEqual(result, 10);
    });
  });
});
