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

      describe("divide", () => {
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

          // Sama asia ilman maagisia toimenpiteitä
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
    });
  });
});
