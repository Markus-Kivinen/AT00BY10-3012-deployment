/**
 * Tests related to type conversion functions such as castArray, toFinite, toInteger, toNumber, and toString.
 */

import { describe, test } from "node:test";
import assert from "assert";
import castArray from "../src/castArray.js";
import toFinite from "../src/toFinite.js";
import toInteger from "../src/toInteger.js";
import toNumber from "../src/toNumber.js";
import toString from "../src/toString.js";

describe("Muunnokset", () => {
  describe("castArray", () => {
    test("Muuntaa luvun taulukoksi", () => {
      const result = castArray(1);
      assert.deepStrictEqual(result, [1]);
    });
    test("Ei muuta taulukkoa", () => {
      const result = castArray([1]);
      assert.deepStrictEqual(result, [1]);
    });
    test("Muuntaa merkkijonon taulukoksi", () => {
      const result = castArray("abc");
      assert.deepStrictEqual(result, ["abc"]);
    });
    test("Muuntaa nullin taulukoksi", () => {
      const result = castArray(null);
      assert.deepStrictEqual(result, [null]);
    });
    test("Muuntaa ilman argumentteja taulukoksi", () => {
      const result = castArray(undefined);
      assert.deepStrictEqual(result, [undefined]);

      const result2 = castArray();
      assert.deepStrictEqual(result2, [undefined]);
    });
    test("Palauttaa saman taulukon", () => {
      const array = [1, 2, 3];
      const result = castArray(array);
      assert.strictEqual(result, array);
    });
  });

  describe("toFinite", () => {
    test("Muuntaa luvun finitiiviseksi", () => {
      const result = toFinite(3.2);
      assert.strictEqual(result, 3.2);
    });
    test("Muuntaa Number.MIN_VALUE:n finitiiviseksi", () => {
      const result = toFinite(Number.MIN_VALUE);
      assert.strictEqual(result, 5e-324);
    });
    test("Muuntaa Infinity finitiiviseksi", () => {
      const result = toFinite(Infinity);
      assert.strictEqual(result, 1.7976931348623157e308);
    });
    test("Muuntaa merkkijonon finitiiviseksi", () => {
      const result = toFinite("3.2");
      assert.strictEqual(result, 3.2);
    });
  });

  describe("toInteger", () => {
    test("Muuntaa desimaaliluvun kokonaisluvuksi", () => {
      const result = toInteger(3.7);
      assert.strictEqual(result, 3);
    });
    test("Muuntaa negatiivisen desimaaliluvun kokonaisluvuksi", () => {
      const result = toInteger(-2.3);
      assert.strictEqual(result, -2);
    });
    test("Muuntaa merkkijonon kokonaisluvuksi", () => {
      const result = toInteger("4.5");
      assert.strictEqual(result, 4);
    });
  });

  describe("toNumber", () => {
    test("Muuntaa merkkijonon numeroksi", () => {
      const result = toNumber("3.14");
      assert.strictEqual(result, 3.14);
    });
    test("Muuntaa Symbolin numeroksi", () => {
      const sym = Symbol("test");
      const result = toNumber(sym);
      assert.strictEqual(result, NaN);
    });
    test("Muuuntaa numeron numeroksi", () => {
      const result = toNumber(42);
      assert.strictEqual(result, 42);
    });
    test("Muuntaa binääriluvun numeroksi", () => {
      const result = toNumber("0b1010");
      assert.strictEqual(result, 10);
    });
    test("Muuntaa boolean-arvon numeroksi", () => {
      let result = toNumber(true);
      assert.strictEqual(result, 1);

      result = toNumber(false);
      assert.strictEqual(result, 0);
    });
    test("Muuntaa nullin numeroksi", () => {
      const result = toNumber(null);
      assert.strictEqual(result, 0);
    });
    test("Muuntaa undefinedin numeroksi", () => {
      const result = toNumber(undefined);
      assert.strictEqual(result, NaN);
    });
  });

  describe("toString", () => {
    test("Muuntaa numeron merkkijonoksi", () => {
      const result = toString(123);
      assert.strictEqual(result, "123");
    });
    test("Muuntaa boolean-arvon merkkijonoksi", () => {
      let result = toString(true);
      assert.strictEqual(result, "true");

      result = toString(false);
      assert.strictEqual(result, "false");
    });
    test("Muuntaa undefinedin merkkijonoksi", () => {
      const result = toString(undefined);
      assert.strictEqual(result, "undefined");
    });
    test("Muuntaa taulukon merkkijonoksi", () => {
      const arr = [1, 2, 3];
      const result = toString(arr);
      assert.strictEqual(result, "1,2,3");
    });
    test("Muuntaa '0' merkkijonoksi", () => {
      const result = toString(0);
      assert.strictEqual(result, "0");
    });
    test("Muuntaa Symbolin merkkijonoksi", () => {
      const sym = Symbol("test");
      const result = toString(sym);
      assert.strictEqual(result, "Symbol(test)");
    });
    test("Muuntaa nullin merkkijonoksi", () => {
      const result = toString(null);
      assert.strictEqual(result, "null");
    });
  });
});
