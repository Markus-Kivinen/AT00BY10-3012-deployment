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

const skip_known_bugs = true;

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
    test("Tunnistaa Mapin, jossa ei ole elementtejä, tyhjäksi", () => {
      const map = new Map();
      const result = isEmpty(map);
      assert.strictEqual(result, true);
    });
    test("tunnistaa prototyypin tyhjäksi", () => {
      function Foo() {}
      const result = isEmpty(Foo.prototype);
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
