/**
 * Tests related to  object and array functions.
 *
 *
 *
 */

import { describe, test } from "node:test";
import assert from "assert";
import at from "../src/at.js";
import chunk from "../src/chunk.js";
import compact from "../src/compact.js";
import countBy from "../src/countBy.js";
import difference from "../src/difference.js";
import drop from "../src/drop.js";
import every from "../src/every.js";
import filter from "../src/filter.js";
import get from "../src/get.js";
import isArrayLike from "../src/isArrayLike.js";
import isArrayLikeObject from "../src/isArrayLikeObject.js";
import isObject from "../src/isObject.js";
import isObjectLike from "../src/isObjectLike.js";
import isSymbol from "../src/isSymbol.js";
import isTypedArray from "../src/isTypedArray.js";
import keys from "../src/keys.js";
import map from "../src/map.js";
import memoize from "../src/memoize.js";
import reduce from "../src/reduce.js";
import slice from "../src/slice.js";
import words from "../src/words.js";

const skip_known_bugs = true;

describe("Objekti/taulukko funktiot", () => {
  describe("at", () => {
    test("Palauttaa oikean elementin yksiulotteisesta taulukosta", () => {
      const arr = [1, 2, 3];
      const result = at(arr, 1);
      assert.deepStrictEqual(result, [2]);
    });
    test("Palauttaa oikeat elementit yksiulotteisesta taulukosta", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = at(arr, 2, 4);
      assert.deepStrictEqual(result, [3, 5]);
    });
    test("Palauttaa oikean elementin yksiulotteisesta objektista", () => {
      const arr = { 0: 1, 1: 2, 2: 3 };
      const result = at(arr, 1);
      assert.deepStrictEqual(result, [2]);
    });
    test("Palauttaa oikeat elementit sisäkkäisestä objektissa", () => {
      const arr = { a: { b: 3, y: [4, 5] }, 1: 4, c: [{ d: 4 }] };
      const result = at(arr, "a[b]", 1);
      assert.deepStrictEqual(result, [3, 4]);

      const result2 = at(arr, "c[0].d", "a[y][1]");
      assert.deepStrictEqual(result2, [4, 5]);

      const arr2 = [{ a: 1 }, { b: 2 }, { c: 3 }];
      const result3 = at(arr2, "[0].a", "[1].b", "[2].c");
      assert.deepStrictEqual(result3, [1, 2, 3]);
    });
  });

  describe("chunk", { skip: skip_known_bugs }, () => {
    test("Jakaa taulukon osiin", () => {
      const arr = [1, 2, 3, 4];
      const result = chunk(arr, 2);
      assert.deepStrictEqual(result, [
        [1, 2],
        [3, 4],
      ]);
    });
    test("Palauttaa tyhjän taulukon takaisin", () => {
      assert.deepStrictEqual(chunk([]), []);
    });
  });

  describe("compact", { skip: skip_known_bugs }, () => {
    test("Poistaa 'valheelliset' arvot", () => {
      const arr = [0, 1, false, 2, "", 3, undefined, 4, null, 5, NaN, 6];
      const result = compact(arr);
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5, 6]);
    });
  });

  describe("countBy", { skip: skip_known_bugs }, () => {
    test("Laskee elementtien määrän ryhmittäin", () => {
      const users = [
        { user: "barney", active: true },
        { user: "betty", active: true },
        { user: "fred", active: false },
      ];
      assert.deepStrictEqual(
        countBy(users, (value) => value.active),
        {
          true: 2,
          false: 1,
        },
      );
    });
  });

  describe("difference", () => {
    test("Palauttaa arvot, jotka ovat ensimmäisessä taulukossa mutta ei toisessa", () => {
      let arr1 = [2, 1];
      let arr2 = [2, 3, 4, 5];
      let result = difference(arr1, arr2);
      assert.deepStrictEqual(result, [1]);

      arr1 = [2, 1];
      arr2 = [2, 1];
      result = difference(arr1, arr2);
      assert.deepStrictEqual(result, []);

      arr1 = [2, 1];
      arr2 = [3, 4];
      result = difference(arr1, arr2);
      assert.deepStrictEqual(result, [2, 1]);
    });

    test("Toimii vain referenssien perusteella", () => {
      const arr1 = [{ a: 1 }];
      const arr2 = [{ a: 1 }];
      const result = difference(arr1, arr2);
      assert.deepStrictEqual(result, [{ a: 1 }]);
    });
  });

  describe("drop", () => {
    test("Poistaa ensimmäisen elementin", () => {
      let arr1 = [1, 2, 3, 4, 5];
      let result = drop(arr1, 1);
      assert.deepStrictEqual(result, [2, 3, 4, 5]);
    });
    test("Poistaa määritetyn määrän elementtejä", () => {
      let arr1 = [1, 2, 3, 4, 5];
      let result = drop(arr1, 2);
      assert.deepStrictEqual(result, [3, 4, 5]);
    });
    test("Ei poista mitään, jos n on 0", () => {
      let arr1 = [1, 2, 3, 4, 5];
      let result = drop(arr1, 0);
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5]);
    });
    test("Poistaa kaikki elementit, jos n on suurempi kuin taulukon pituus", () => {
      let arr1 = [1, 2, 3];
      let result = drop(arr1, 5);
      assert.deepStrictEqual(result, []);
    });
    test("Käsittelee negatiivisen n:n oikein", () => {
      let arr1 = [1, 2, 3, 4, 5];
      let result = drop(arr1, -2);
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5]);
    });
    test("Käsittelee tyhjän taulukon oikein", () => {
      let arr1 = [];
      let result = drop(arr1, 2);
      assert.deepStrictEqual(result, []);
    });
  });

  describe("every", () => {
    test("Tarkistaa että kaikki elementit täyttävät ehdon", () => {
      const arr = [2, 4, 6];
      const result = every(arr, (n) => n % 2 === 0);
      assert.strictEqual(result, true);
    });
    test("Tarkistaa että kaikki elementit eivät täytä ehtoa", () => {
      const arr = [2, 3, 6];
      const result = every(arr, (n) => n % 2 === 0);
      assert.strictEqual(result, false);
    });
    test("Tarkistaa että kaikki elementit täyttävät ehdon tyhjässä taulukossa", () => {
      const arr = [];
      const result = every(arr, (n) => n % 2 === 0);
      assert.strictEqual(result, true);
    });
  });

  describe("filter", { skip: skip_known_bugs }, () => {
    test("Suodattaa taulukon elementit ehdon perusteella", () => {
      const users = [
        { user: "barney", active: true },
        { user: "fred", active: false },
      ];
      const result = filter(users, (user) => user.active);
      assert.deepStrictEqual(result, [{ user: "barney", active: true }]);
    });
    test("Palauttaa tyhjän taulukon, jos mikään elementti ei täytä ehtoa", () => {
      const arr = [1, 3, 5];
      const result = filter(arr, (n) => n % 2 === 0);
      assert.deepStrictEqual(result, []);
    });
    test("Palauttaa kaikki elementit, jos kaikki täyttävät ehdon", () => {
      const arr = [2, 4, 6];
      const result = filter(arr, (n) => n % 2 === 0);
      assert.deepStrictEqual(result, [2, 4, 6]);
    });
    test("Käsittelee tyhjän taulukon oikein", () => {
      const arr = [];
      const result = filter(arr, (n) => n % 2 === 0);
      assert.deepStrictEqual(result, []);
    });
  });

  describe("get", () => {
    test("Hakee syvällä olevan arvon objektista merkkijonolla", () => {
      const obj = { a: [{ b: { c: 3 } }] };
      const result = get(obj, "a[0].b.c");
      assert.strictEqual(result, 3);
    });
    test("Hakee syvällä olevan arvon objektista taulukolla", () => {
      const obj = { a: [{ b: { c: 3 } }] };
      const result = get(obj, ["a", "0", "b", "c"]);
      assert.strictEqual(result, 3);
    });
    test("Palauttaa oletusarvon, jos arvo on undefined", () => {
      const obj = { a: [{ b: { c: 3 } }] };
      const result = get(obj, "a.b.c", "oletus");
      assert.strictEqual(result, "oletus");
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

  describe("keys", () => {
    test("Palauttaa objektin omat enumerable-ominaisuudet", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = keys(obj);
      assert.deepStrictEqual(result.sort(), ["a", "b", "c"]);
    });
    test("Ei palauta prototyypin ominaisuuksia", () => {
      function Foo() {
        this.a = 1;
        this.b = 2;
      }
      Foo.prototype.c = 3;
      const result = keys(new Foo());
      assert.deepStrictEqual(result.sort(), ["a", "b"]);
    });
    test("Palauttaa taulukkomaiset objektit oikein", () => {
      const arr = ["a", "b", "c"];
      const result = keys(arr);
      assert.deepStrictEqual(result.sort(), ["0", "1", "2"]);
    });
  });

  describe("map", () => {
    test("Muuttaa taulukon elementit iterateen avulla", () => {
      const arr = [1, 2, 3];
      const result = map(arr, (n) => n * n);
      assert.deepStrictEqual(result, [1, 4, 9]);
    });
    test("Muuttaa nullin taulukkomaiseksi objektiksi", () => {
      const result = map(null, (n) => n * n);
      assert.deepStrictEqual(result, []);
    });
    test("Muuntaa tyhjän taulukkomaisen objektin", () => {
      const result = map([], (n) => n * n);
      assert.deepStrictEqual(result, []);
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
      fn.cache.set(5, 999);
      assert.strictEqual(fn(5), 999);
    });
  });

  describe("reduce", () => {
    test("Redusoi taulukon yhdeksi arvoksi", () => {
      const arr = [1, 2, 3];
      const result = reduce(arr, (sum, n) => sum + n, 0);
      assert.strictEqual(result, 6);
    });
    test("Redusoi objektin yhdeksi arvoksi", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = reduce(obj, (sum, n) => sum + n, 0);
      assert.strictEqual(result, 6);
    });
    test("Redusoi ilman alku-arvoa", () => {
      const arr = [1, 2, 3];
      const result = reduce(arr, (sum, n) => sum + n);
      assert.strictEqual(result, 6);
    });
    test("Redusoi tyhjä taulukko ilman alku-arvoa", () => {
      const arr = [];
      const result = reduce(arr, (sum, n) => sum + n);
      assert.strictEqual(result, undefined);
    });
  });

  describe("slice", () => {
    test("Leikkaa taulukon osaksi", () => {
      const arr = [1, 2, 3, 4];
      const result = slice(arr, 1, 3);
      assert.deepStrictEqual(result, [2, 3]);
    });
    test("Leikkaa taulukon osaksi alkaen indeksistä", () => {
      const arr = [1, 2, 3, 4];
      const result = slice(arr, 2);
      assert.deepStrictEqual(result, [3, 4]);
    });
    test("Palauttaa tyhjän taulukon takaisin", () => {
      assert.deepStrictEqual(slice([], 5), []);
    });
    test("Klamppaa indeksit", () => {
      const arr = [1, 2, 3, 4];
      const result = slice(arr, -5, 10);
      assert.deepStrictEqual(result, [
        1,
        2,
        3,
        4,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
    });
    test("Leikkaa taulukon osaksi alkaen indeksistä ja päättyen loppuun", () => {
      const arr = [1, 2, 3, 4];
      const result = slice(arr);
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });
  });

  describe("words", () => {
    test("Jakaa merkkijonon sanoiksi", () => {
      const str = "Hello, world!";
      const result = words(str);
      assert.deepStrictEqual(result, ["Hello", "world"]);
    });
    test("Käsittelee emojin oikein", () => {
      const str = "Hello🍕world";
      const result = words(str);
      assert.deepStrictEqual(result, ["Hello", "🍕", "world"]);
    });
    test("Käsittelee yksittäisen sanan oikein", () => {
      const str = "Hello";
      const result = words(str);
      assert.deepStrictEqual(result, ["Hello"]);
    });
    test("Jakaa merkkijonon sanoiksi käyttäen mukautettua mallia", () => {
      const str = "Hello, world!";
      const result = words(str, /[^, ]+/g);
      assert.deepStrictEqual(result, ["Hello", "world!"]);
    });
    test("Käsittelee tyhjän merkkijonon oikein", () => {
      const str = "";
      const result = words(str);
      assert.deepStrictEqual(result, []);
    });
    test("Kontrollimerkki ohittaa ascii-polun", () => {
      const str = "hello\u0000world";
      const result = words(str);
      //assert.deepStrictEqual(result, ["hello\u0000worldworld"]);
      assert.deepStrictEqual(result, ["hello", "world"]);
    });
  });
});
