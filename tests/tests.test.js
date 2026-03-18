import { describe, test } from "node:test";
import assert from "assert";
import add from "../src/add.js";
import at from "../src/at.js";
import camelCase from "../src/camelCase.js";
import capitalize from "../src/capitalize.js";
import castArray from "../src/castArray.js";
import ceil from "../src/ceil.js";
import chunk from "../src/chunk.js";
import clamp from "../src/clamp.js";
import compact from "../src/compact.js";
import countBy from "../src/countBy.js";
import defaultTo from "../src/defaultTo.js";
import defaultToAny from "../src/defaultToAny.js";
import difference from "../src/difference.js";
import divide from "../src/divide.js";
import drop from "../src/drop.js";
import endsWith from "../src/endsWith.js";
import eq from "../src/eq.js";
import every from "../src/every.js";
import filter from "../src/filter.js";
import get from "../src/get.js";
import isArguments from "../src/isArguments.js";
import isArrayLike from "../src/isArrayLike.js";
import isArrayLikeObject from "../src/isArrayLikeObject.js";
import isBoolean from "../src/isBoolean.js";
import isBuffer from "../src/isBuffer.js";
import isDate from "../src/isDate.js";
import isEmpty from "../src/isEmpty.js";
import isLength from "../src/isLength.js";
import isObject from "../src/isObject.js";
import isObjectLike from "../src/isObjectLike.js";
import isSymbol from "../src/isSymbol.js";
import isTypedArray from "../src/isTypedArray.js";
import keys from "../src/keys.js";
import map from "../src/map.js";
import memoize from "../src/memoize.js";
import reduce from "../src/reduce.js";
import slice from "../src/slice.js";
import toFinite from "../src/toFinite.js";
import toInteger from "../src/toInteger.js";
import toNumber from "../src/toNumber.js";
import toString from "../src/toString.js";
import upperFirst from "../src/upperFirst.js";
import words from "../src/words.js";

const skip_known_bugs = false;

describe("Yksikkötestit", () => {
  describe("Matemaattiset funktiot", () => {
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

    describe("divide", { skip: skip_known_bugs }, () => {
      test("Jakaa kaksi lukua", () => {
        const result = divide(6, 3);
        assert.strictEqual(result, 2);
      });
      test("Palauttaaa Infinity jakamalla nollalla", () => {
        const result = divide(6, 0);
        console.error("Result:", result);
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
        let result = ceil(5.005, 2);
        assert.strictEqual(result, 5.01);

        result = ceil(7040, -2);
        assert.strictEqual(result, 7100);
      });
    });

    describe("clamp", { skip: skip_known_bugs }, () => {
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

    describe("chunk", { skip: skip_known_bugs }, () => {
      test("Jakaa taulukon osiin", () => {
        const arr = [1, 2, 3, 4];
        const result = chunk(arr, 2);
        assert.deepStrictEqual(result, [
          [1, 2],
          [3, 4],
        ]);
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
    });
  });

  describe("Muunnokset", () => {
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
      test("Muuntaa nullin merkkijonoksi", () => {
        const result = toString(null);
        assert.strictEqual(result, "null");
      });
    });
  });

  describe("Utility", () => {
    describe("defaultTo", { skip: skip_known_bugs }, () => {
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

    describe("defaultToAny", { skip: skip_known_bugs }, () => {
      test("Palauttaa ensimmäisen kelvollisen arvon", () => {
        const result = defaultToAny(undefined, null, NaN, "oletus", 42);
        assert.strictEqual(result, "oletus");
      });
      test("Palauttaa ensimmäisen kelvollisen arvon vaikka se olisi 0", () => {
        const result = defaultToAny(undefined, null, NaN, 0, "oletus");
        assert.strictEqual(result, 0);
      });
    });

    describe("eq", { skip: skip_known_bugs }, () => {
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
      test("Ei tunnista nollia tyhjäksi", () => {
        const result = isEmpty(0);
        assert.strictEqual(result, true);
      });
      test("Tunnistaa nullin tyhjäksi", () => {
        const result = isEmpty(null);
        assert.strictEqual(result, true);
      });
      test("Tunnistaa undefinedin tyhjäksi", () => {
        const result = isEmpty(undefined);
        assert.strictEqual(result, true);
      });
      test("Tunnistaa tyhjän merkkijonon tyhjäksi", () => {
        const result = isEmpty("");
        assert.strictEqual(result, true);
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

    describe("isBuffer", { skip: skip_known_bugs }, () => {
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

  describe("Tekstinkäsittely", () => {
    describe("camelCase", { skip: skip_known_bugs }, () => {
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
});
