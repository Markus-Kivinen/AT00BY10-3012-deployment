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

const skip_known_bugs = true;

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
  });

  describe("Tekstinkäsittely", () => {
    describe("camelCase", { skip: skip_known_bugs }, () => {
      test("Muuttaa merkkijonon kameliksi", () => {
        const result = camelCase("hello world");
        assert.strictEqual(result, "helloWorld");
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
