/**
 * Tests related to utility functions such as
 * defaultTo, eq, isEmpty, isLength, isBuffer, isDate, isSymbol, memoize, and isObject.
 */

import { describe, test } from "node:test";
import assert from "assert";
import defaultTo from "../src/defaultTo.js";
import defaultToAny from "../src/defaultToAny.js";
import eq from "../src/eq.js";
import isArguments from "../src/isArguments.js";
import isBoolean from "../src/isBoolean.js";
import isBuffer from "../src/isBuffer.js";
import isDate from "../src/isDate.js";
import isEmpty from "../src/isEmpty.js";
import isLength from "../src/isLength.js";
import isSymbol from "../src/isSymbol.js";
import memoize from "../src/memoize.js";
import isArrayLike from "../src/isArrayLike.js";
import isArrayLikeObject from "../src/isArrayLikeObject.js";
import isObject from "../src/isObject.js";
import isObjectLike from "../src/isObjectLike.js";
import isTypedArray from "../src/isTypedArray.js";

describe("Utility", () => {
  describe("defaultTo", () => {
    test("Palauttaa oletusarvon jos arvo on undefined", () => {
      const result = defaultTo(undefined, "oletus");
      assert.strictEqual(result, "oletus");
    });
    test("Palauttaa oletusarvon jos arvo on NaN", () => {
      const result = defaultTo(NaN, "oletus");
      assert.strictEqual(result, "oletus");
    });
    test("Palauttaa oletusarvon jos arvo on null", () => {
      const result = defaultTo(null, "oletus");
      assert.strictEqual(result, "oletus");
    });
    test("EI palauta oletusarvoa jos arvo on 0", () => {
      const result = defaultTo(0, "oletus");
      assert.strictEqual(result, 0);
    });
  });

  describe("defaultToAny", () => {
    test("Palauttaa ensimmäisen kelvollisen arvon", () => {
      const result = defaultToAny(undefined, null, NaN, "oletus", 42);
      assert.strictEqual(result, "oletus");
    });
    test("Palauttaa ensimmäisen kelvollisen arvon vaikka se olisi 0", () => {
      const result = defaultToAny(undefined, null, NaN, 0, "oletus");
      assert.strictEqual(result, 0);
    });
  });

  describe("eq", () => {
    test("Vertaa kahta arvoa ja palauttaa true jos ne ovat samat", () => {
      const result = eq(1, 1);
      assert.strictEqual(result, true);
    });
    test("Vertaa kahta arvoa ja palauttaa false jos ne ovat eri tyyppisiä", () => {
      const result = eq(1, "1");
      assert.strictEqual(result, false);
    });
    test("Vertaa kahta arvoa ja palauttaa true jos molemmat ovat NaN", () => {
      const result = eq(NaN, NaN);
      assert.strictEqual(result, true);
    });
  });

  describe("isArguments", () => {
    test("Tunnistaa arguments-objektin", () => {
      const func = function () {
        return arguments;
      };
      var args = func(1, 2, 3);
      const result = isArguments(args);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista tavallista taulukkoa arguments-objektiksi", () => {
      const result = isArguments([1, 2, 3]);
      assert.strictEqual(result, false);
    });
  });

  describe("isBoolean", () => {
    test("Tunnistaa boolean-arvon", () => {
      const result = isBoolean(true);
      assert.strictEqual(result, true);
    });
    test("Tunnistaa boolean-objektin", () => {
      const result = isBoolean(new Boolean(false));
      assert.strictEqual(result, true);
    });
    test("Ei tunnista muita arvoja booleaniksi", () => {
      let result = isBoolean(0);
      assert.strictEqual(result, false);

      result = isBoolean(NaN);
      assert.strictEqual(result, false);

      result = isBoolean(undefined);
      assert.strictEqual(result, false);

      result = isBoolean(null);
      assert.strictEqual(result, false);
    });
  });

  describe("isEmpty", () => {
    test("Tunnistaa luvut tyhjäksi", () => {
      // Lodash style approach is to treats all numbers as empty,
      // which is a bit odd but we'll go with it for now.
      let result = isEmpty(0);
      assert.strictEqual(result, true);

      result = isEmpty(42);
      assert.strictEqual(result, true);
    });
    test("Tunnistaa nullin tyhjäksi", () => {
      const result = isEmpty(null);
      assert.strictEqual(result, true);
    });
    test("Tunnistaa Mapin, jossa ei ole elementtejä, tyhjäksi", () => {
      let map = new Map();
      let result = isEmpty(map);
      assert.strictEqual(result, true);

      map.set("key", "value");
      result = isEmpty(map);
      assert.strictEqual(result, false);
    });
    test("tunnistaa prototyypin tyhjäksi", () => {
      class Foo {
        constructor() {}
      }
      const result = isEmpty(Foo.prototype);
      assert.strictEqual(result, true);

      Foo.prototype.bar = function () {};
      const result2 = isEmpty(Foo.prototype);
      assert.strictEqual(result2, false);
    });

    test("Tunnistaa undefinedin tyhjäksi", () => {
      const result = isEmpty(undefined);
      assert.strictEqual(result, true);
    });
    test("Tunnistaa tyhjän merkkijonon tyhjäksi", () => {
      const result = isEmpty("");
      assert.strictEqual(result, true);

      const result2 = isEmpty(" ");
      assert.strictEqual(result2, false);
    });
    test("Tunnistaa taulukon, jossa ei ole elementtejä, tyhjäksi", () => {
      const result = isEmpty([]);
      assert.strictEqual(result, true);

      const result2 = isEmpty([0]);
      assert.strictEqual(result2, false);
    });
    test("Tunnistaa objektin, jolla ei ole omia enumerable-ominaisuuksia, tyhjäksi", () => {
      const result = isEmpty({});
      assert.strictEqual(result, true);

      const result2 = isEmpty({ a: 1 });
      assert.strictEqual(result2, false);
    });
  });

  describe("isLength", () => {
    test("Hyväksyy positiivisen luvun", () => {
      const result = isLength(3);
      assert.strictEqual(result, true);
    });
    test("Ei hyväksy negatiivista lukua", () => {
      const result = isLength(-1);
      assert.strictEqual(result, false);
    });
    test("Ei hyväksy desimaalilukua", () => {
      const result = isLength(3.5);
      assert.strictEqual(result, false);
    });
    test("Ei hyväksy merkkijonoa", () => {
      const result = isLength("2");
      assert.strictEqual(result, false);
    });
    test("Ei hyväksy Infinitya", () => {
      const result = isLength(Infinity);
      assert.strictEqual(result, false);
    });
    test("Hyväksyy 0:n", () => {
      const result = isLength(0);
      assert.strictEqual(result, true);
    });
    test("Ei hyväksy '0'", () => {
      const result = isLength("0");
      assert.strictEqual(result, false);
    });
  });

  describe("isBuffer", () => {
    test("Tunnistaa Buffer-objektin", () => {
      const buffer = Buffer.from("test");
      const result = isBuffer(buffer);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista Uint8Array-objektia Bufferiksi", () => {
      const uint8Array = new Uint8Array(4);
      const result = isBuffer(uint8Array);
      assert.strictEqual(result, false);
    });
  });

  describe("isArrayLike", () => {
    test("Tunnistaa taulukkomaisen objektin", () => {
      const obj = { length: 3, 0: "a", 1: "b", 2: "c" };
      const result = isArrayLike(obj);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista funktiota taulukkomaiseksi objektiksi", () => {
      const func = function () {};
      const result = isArrayLike(func);
      assert.strictEqual(result, false);
    });
    test("Tunnistaa merkkijonon taulukkomaiseksi objektiksi", () => {
      const result = isArrayLike("abc");
      assert.strictEqual(result, true);
    });
    test("Tunnistaa taulukon taulukkomaiseksi objektiksi", () => {
      const result = isArrayLike([1, 2, 3]);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista luokkaa taulukkomaiseksi objektiksi", () => {
      class MyClass {
        static length = 3;
      }
      const result = isArrayLike(MyClass);
      assert.strictEqual(result, false);
    });
  });

  describe("isArrayLikeObject", () => {
    test("Tunnistaa taulukkomaisen objektin", () => {
      const obj = { length: 3, 0: "a", 1: "b", 2: "c" };
      const result = isArrayLikeObject(obj);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista funktiota taulukkomaiseksi objektiksi", () => {
      const func = function () {};
      const result = isArrayLikeObject(func);
      assert.strictEqual(result, false);
    });
    test("Ei tunnista merkkijonoa taulukkomaiseksi objektiksi", () => {
      const result = isArrayLikeObject("abc");
      assert.strictEqual(result, false);
    });
    test("Tunnistaa taulukon taulukkomaiseksi objektiksi", () => {
      const result = isArrayLikeObject([1, 2, 3]);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista luokkaa taulukkomaiseksi objektiksi", () => {
      class MyClass {
        static length = 3;
      }
      const result = isArrayLikeObject(MyClass);
      assert.strictEqual(result, false);
    });
  });

  describe("isObject", () => {
    test("Tunnistaa objektin", () => {
      const result = isObject({ a: 1 });
      assert.strictEqual(result, true);
    });
    test("Tunnistaa taulukon objektiksi", () => {
      const result = isObject([1, 2, 3]);
      assert.strictEqual(result, true);
    });
    test("Tunnistaa funktion objektiksi", () => {
      const func = function () {};
      const result = isObject(func);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista nullia objektiksi", () => {
      const result = isObject(null);
      assert.strictEqual(result, false);
    });
    test("Tunnistaa Number-objektin objektiksi", () => {
      const result = isObject(new Number(5));
      assert.strictEqual(result, true);
    });
    test("Tunnistaa String-objektin objektiksi", () => {
      const result = isObject(new String("test"));
      assert.strictEqual(result, true);
    });
    test("Tunnistaa luokan objektiksi", () => {
      class MyClass {}
      const result = isObject(MyClass);
      assert.strictEqual(result, true);
    });
  });

  describe("isObjectLike", () => {
    test("Tunnistaa objektimaisen arvon", () => {
      const result = isObjectLike({ a: 1 });
      assert.strictEqual(result, true);
    });
    test("Tunnistaa taulukomaisen objektin", () => {
      const obj = { length: 3, 0: "a", 1: "b", 2: "c" };
      const result = isObjectLike(obj);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista funktiota objektimaiseksi", () => {
      const func = function () {};
      const result = isObjectLike(func);
      assert.strictEqual(result, false);
    });
    test("Ei tunnista nullia objektimaiseksi", () => {
      const result = isObjectLike(null);
      assert.strictEqual(result, false);
    });
  });

  describe("isTypedArray", () => {
    test("Tunnistaa Uint8Array-objektin", () => {
      const uint8Array = new Uint8Array(4);
      const result = isTypedArray(uint8Array);
      assert.strictEqual(result, true);
    });
    test("Tunnistaa Float32Array-objektin", () => {
      const float32Array = new Float32Array(4);
      const result = isTypedArray(float32Array);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista tavallista taulukkoa typed arrayksi", () => {
      const result = isTypedArray([1, 2, 3]);
      assert.strictEqual(result, false);
    });
    test("Ei tunnista merkkijonoa typed arrayksi", () => {
      const result = isTypedArray("abc");
      assert.strictEqual(result, false);
    });
    test("Ei tunnista tyhjää taulukkoa typed arrayksi", () => {
      const result = isTypedArray([]);
      assert.strictEqual(result, false);
    });
  });

  describe("isSymbol", () => {
    test("Tunnistaa symbolin", () => {
      const sym = Symbol("test");
      const result = isSymbol(sym);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista merkkijonoa symboliksi", () => {
      const result = isSymbol("test");
      assert.strictEqual(result, false);
    });
    test("Ei tunnista numeroa symboliksi", () => {
      const result = isSymbol(123);
      assert.strictEqual(result, false);
    });
  });

  describe("memoize", () => {
    test("Palauttaa välimuistista samalla avaimella", () => {
      let callCount = 0;
      const summa = memoize((a, b) => {
        callCount++;
        return a + b;
      });
      const result1 = summa(2, 3);
      const result2 = summa(2, 3);
      assert.strictEqual(result1, 5);
      assert.strictEqual(result2, 5);
      assert.strictEqual(callCount, 1);
    });

    test("Laskee uudestaan eri avaimella", () => {
      let callCount = 0;
      const summa = memoize((a, b) => {
        callCount++;
        return a + b;
      });
      const result1 = summa(2, 3);
      const result2 = summa(3, 4);
      assert.strictEqual(result1, 5);
      assert.strictEqual(result2, 7);
      assert.strictEqual(callCount, 2);
    });

    test("Resolverin avulla voidaan käyttää 'syviä' objekteja", () => {
      let callCount = 0;
      const deepSum = memoize(
        (obj) => {
          callCount++;
          return Object.values(obj).reduce((sum, n) => sum + n, 0);
        },
        (obj) => JSON.stringify(obj),
      );
      const arg1 = { a: 1, b: 2 };
      const arg2 = { a: 1, b: 2 };
      const result1 = deepSum(arg1);
      const result2 = deepSum(arg2);
      assert.strictEqual(result1, 3);
      assert.strictEqual(result2, 3);
      assert.strictEqual(callCount, 1);
    });

    test("Cachea voi muokata suoraan", () => {
      const fn = memoize((n) => n * 2);
      // Verifies that memoize exposes a mutable cache map as part of its API.
      fn.cache.set(5, 999);
      assert.strictEqual(fn(5), 999);
    });
  });

  describe("isDate", () => {
    test("Tunnistaa Date-objektin", () => {
      const date = new Date();
      const result = isDate(date);
      assert.strictEqual(result, true);
    });
    test("Ei tunnista merkkijonoa Date-objektiksi", () => {
      const result = isDate("2024-01-01");
      assert.strictEqual(result, false);
    });
    test("Ei tunnista numeroa Date-objektiksi", () => {
      const result = isDate(1700000000000);
      assert.strictEqual(result, false);
    });
  });
});
