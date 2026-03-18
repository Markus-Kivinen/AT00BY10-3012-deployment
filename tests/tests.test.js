import { describe, test } from "node:test";
import assert from "assert";
import add from "../src/add.js";
import at from "../src/at.js";
import camelCase from "../src/camelCase.js";
import capitalize from "../src/capitalize.js";
import castArray from "../src/castArray.js";

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
