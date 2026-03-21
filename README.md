# Testaus, CI ja Coveralls

[![Coverage Status](https://coveralls.io/repos/github/Markus-Kivinen/AT00BY10-3012-deployment/badge.svg?cache-control=no-cache)](https://coveralls.io/github/Markus-Kivinen/AT00BY10-3012-deployment)

## Sisällysluettelo

- [Projektin rakenne](#projektin-rakenne)
- [Lähestymistapa ja toteutus](#lähestymistapa-ja-toteutus)
- [Ympäristö ja kirjastot](#ympäristö-ja-kirjastot)
- [Konfigurointi](#konfigurointi)
- [Komennot](#komennot)
- [GitHub Actions](#github-actions)
- [Testaus ja raportointi](#testaus-ja-raportointi)
- [Kattavuusraportit](#kattavuusraportit)
- [Lopullinen arvio tuotantovalmiudesta](#lopullinen-arvio-tuotantovalmiudesta)

## Projektin rakenne

Alla on nykyisen projektin rakenne tiivistettynä:

```text
Project/
├── .github/                # GitHubin työnkulut
│   └── workflows/
│       └── ci.yml
├── coverage/               #.gitignorattu kansio kattavuusraporteille
│   ├── lcov.info               # Kattavuustiedot Coverallsille
├── img/                    # Kuvat workflowsta ja testituloksista
│   ├── workflow-0.png
│   ├── workflow-1.png
│   ├── workflow-2.png
│   ├── test_fail.jpg
│   ├── test_pass.jpg
├── scripts/                # Skripti kattavuusraporttien ajamiseen
│   └── run-coverage.js
├── src/                    # Testattavat funktiot
│   ├── .internal/              # Sisäiset apufunktiot
│   ├── add.js
│   ├── at.js
│   ├── camelCase.js
│   ├── ...
│   └── words.js
├── tests/                  # Testit ja testikategoriat
│   ├── number.test.js
│   ├── object.test.js
│   ├── string.test.js
│   ├── transform.test.js
│   └── utility.test.js
├── .gitignore
├── eslint.config.js        # ESLintin konfiguraatiotiedosto
├── LICENSE
├── package-lock.json
├── package.json            # Projektin konfiguraatiotiedosto
└── README.md
```


## Lähestymistapa ja toteutus

Alkuperäinen projekti ei sisältänyt lainkaan lintteriä tai testejä, joten aloitin asentamalla ESLintin ja konfiguroimalla sen. Lähtötavoitteena oli muutaman perustestin tekeminen jokaiselle funktiolle.

Kävin funktiot läpi aakkosjärjestyksessä, poissulkien ne funktiot jotka sijaitsevat .internal-kansiossa, koska ne on tarkoitettu vain kirjaston sisäiseen käyttöön.  
Aloitin luomalla yksikkötestit muutamalle ensimmäiselle funktiolle ja testasin testien ajamisen lokaalisti. Testien toiminnan varmistamisen jälkeen päätin että on aika ottaa käyttöön CI, jotta testit ja linttaus voidaan ajaa automaattisesti joka ikiselle pushille. Samalla konfiguroin lintterin poissulkemaan .internal-kansion, jotta se ei aiheuttaisi ylimääräisiä varoituksia.

Löysin ensimmäisen virheen jo ensimmäisten testien aikana, joten loin toistaiseksi `skip_known_bugs` muuttujan, jota käytin tunnettujen virheiden ohittamiseen. Loin myös raportit jokaiselle löydetylle virheella/ongelmalle, sitä mukaa kun kohtasin ne.

Muutaman kymmenen funktion testauksen jälkeen päätin että on aika ottaa käyttöön kattavuusraportit, jotta näen missä funktioissa on vielä kattavuusongelmia. Asensin c8-kirjaston ja konfiguroin sen tuottamaan kattavuusraportit ja poissulkemaan .internal-kansion. Lisäsin vielä tämän vaiheen CI-työnkulun loppuun. Lisäsin myös badge:n README:hen näyttämään kattavuuden tason suoraan GitHubissa. Muutaman testin jälkeen muutin vielä työnkulun lähettämään kattavuusraportit Coverallsille, vaikka testit epäonnistuvaisitkin.

Kirjoitin lopuillekin funktioille testit. Kaikkien testien kirjoittamisen jälkeen päätin jakaa luodut testit useampaan tiedostoon ja kategorioida ne. Kaikkien testien ja raporttien luomisen jälkeen siirryin korjaamaan löydettyjä ongelmia, jotka testit paljastivat. Kaikkien ongelmien korjaamisen jälkeen poistin `skip_known_bugs` -muuttujan ja kaikki siihen liittyvät ohitukset, jotta testit ajaisivat kaikki funktiot läpi.

Lopulta päädyin vielä korvaamaan c8:n omalla skriptillä, joka ajaa testit ja luo vaadittavat tiedostot coverallsille, koska halusin välttää ylimääräisiä kirjastoja.
Skripti löytyy [scripts/run-coverage.js](scripts/run-coverage.js) -tiedostosta.

Projektissa oli muutamia haasteita:
* Noden oman kattavuusraportoinnin käyttö ja konfiguroiminen, koska se ei ollut minulle ennestään tuttu työkalu, ja konfigurointi ei onnistunut yhtä kätevesti kuin c8:n kanssa.
* Monet funktioista tekivät automaattisen tyyppimuunnoksen väärän tyyppisille syötteille, tämä vaati miettimään mikä halutun lopputuloksen tulisi olla.

### Ympäristö ja kirjastot

- Testattu Window 10:llä ja cachyOS:llä
- Node.js versio: 24.6.0
- NPM versio: 11.6.1
- testit kirjoitettu käyttäen Node.js:n sisäänrakennettua testausmoduulia
- coverage raportit luotu käyttäen Node.js:n sisäänrakennettua kattavuusmoduulia

Kehitys riippuvuudet:
- ESLint: 10.0.3
  - @eslint/js: 10.0.1
  - globals: 17.4.0

### Konfigurointi

- ESLint
  - Konfiguraatiotiedosto: [eslint.config.js](eslint.config.js)
  - Linttauskomento `npm run lint`
- coverage
  - Ajotiedosto (sis konfiguraatiot): [scripts/run-coverage.js](scripts/run-coverage.js)
  - Testikomento: `npm run coverage`

### Komennot

```bash
npm install
npm run test
npm run coverage
npm run lint
```

### GitHub Actions

- CI-Työnkulun tiedosto: `.github/workflows/ci.yml`
- Ajetaan joka ikiselle pushille
- Workflown vaiheet:
  - 1. linttaus
  - 2. testit ja kattavuusraportti.  
       kattavuusraportti lähetetään Coverallsille vaikka testit epäonnistuisivatkin.

[Actions](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/actions) -sivulta löytyy kaikki työnkulut ja niiden tulokset.

<details><summary>

### Kuvat workflowsta

</summary>

![alt text](img/workflow-0.png)
![alt text](img/workflow-1.png)
![alt text](img/workflow-2.png)

</details>

## Testaus ja raportointi

Testeissä keskityin testaamaan funktioiden perustoimintoja ja odottamattomia syötteitä. Testit kirjoitettiin käyttäen Node.js:n sisäänrakennettua testausmoduulia, joka oli aivan riittävä tähän projektiin.

Alkuun testejä oli tarkoitus kirjoittaa vain muutama per funktio, mutta funktion käyttäytyessä oudosti kirjoitin lisää testejä kattamaan erilaisia skenaarioita. Lisäsin myös testejä siinä tapauksessa että funktion coverage oli erityisen alhainen esim. < 80%.

Yhteensä testejä muodostui 168 kappaletta, joten lopuksi päätin jakaa ne vielä useampaan tiedostoon kategorioittain, jotta testit olisivat ylläpidettävämpiä. 

### Esimerkki funktion testeistä

```js
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
```

### Testien suoritus

Komento: `npm test`

### Testitulokset
[Testitulokset GitHub Actionsissa](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/actions/runs/23381936291/job/68022680106#step:5:1)

<details><summary>

#### Epäonnistuneet testit

</summary>

![alt text](img/test_fail.jpg)

</details>
<br>

<details><summary>

#### Korjatut testit

</summary>

![alt text](img/test_pass.jpg)
</details>
<br>

### Virhe/Ongelma-raportit

Testeissä löytyi useita ongelmia, joista jokaisesta luotiin raportti GitHubiin.  
Yhteensä löydettiin:

- 12 Korjattavaa virhettä, [Virhe-raportit](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/issues?q=is%3Aissue%20state%3Aclosed%20label%3Abug)
- 29 korjattavissa olevaa eqeqeq-varoitusta ESLintiltä, katso [issue #10](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/issues/10) ja [issue #1](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/issues/1)
- 1 ohitettava `no-control-regex`-varoitus ESLintiltä, katso [issue #14](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/issues/14)
- 2 paranneltavaa funktiota, katso [enhancement-raportit](https://github.com/Markus-Kivinen/AT00BY10-3012-deployment/issues?q=is%3Aissue%20state%3Aclosed%20label%3Aenhancement)

Jokainen löydetty ongelma korjattiin, minkä jälkeen testit ajettiin uudestaan varmistamaan että korjaukset olivat onnistuneita. Kaikki löydetyt ongelmat on merkitty closed-tilaan.

## Kattavuusraportit

Täysi kattavuusraportti saatavissa readme.MD:n alussa olevan badgen kautta tai suoraan [tästä](https://coveralls.io/github/Markus-Kivinen/AT00BY10-3012-deployment) linkistä.

### Kattavuusraportin ajo

Komento: `npm run coverage`  
Ajo-komento suorittaa scriptin `scripts/run-coverage.js`, joka sisältää myös tarvittavat konfiguraatiot.

### Kattavuusraportti

Kattavuus

- 1437 of 1440 relevant lines covered (99.79%)
- 214 of 246 branches covered (86.99%)

Alla on esimerkki tulostus `npm run coverage` -komennosta:

<details><summary>

#### Kattavuusraportti tekstinä

</summary>

```bash
ℹ start of coverage report
ℹ ------------------------------------------------------------------------
ℹ file                    | line % | branch % | funcs % | uncovered lines
ℹ ------------------------------------------------------------------------
ℹ src                     |        |          |         |
ℹ  add.js                 | 100.00 |   100.00 |  100.00 |
ℹ  at.js                  | 100.00 |   100.00 |  100.00 |
ℹ  camelCase.js           | 100.00 |   100.00 |  100.00 |
ℹ  capitalize.js          | 100.00 |   100.00 |  100.00 |
ℹ  castArray.js           | 100.00 |   100.00 |  100.00 |
ℹ  ceil.js                | 100.00 |   100.00 |  100.00 |
ℹ  chunk.js               | 100.00 |    83.33 |  100.00 |
ℹ  clamp.js               | 100.00 |    75.00 |  100.00 |
ℹ  compact.js             | 100.00 |   100.00 |  100.00 |
ℹ  countBy.js             | 100.00 |   100.00 |  100.00 |
ℹ  defaultTo.js           | 100.00 |   100.00 |  100.00 |
ℹ  defaultToAny.js        | 100.00 |   100.00 |  100.00 |
ℹ  difference.js          | 100.00 |    66.67 |  100.00 |
ℹ  divide.js              | 100.00 |   100.00 |  100.00 |
ℹ  drop.js                | 100.00 |    85.71 |  100.00 |
ℹ  endsWith.js            | 100.00 |   100.00 |  100.00 |
ℹ  eq.js                  | 100.00 |   100.00 |  100.00 |
ℹ  every.js               | 100.00 |    83.33 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isBuffer.js            | 100.00 |    33.33 |    0.00 |
ℹ  isDate.js              | 100.00 |    60.00 |   50.00 |
ℹ  isEmpty.js             | 100.00 |    78.95 |  100.00 |
ℹ  isLength.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObject.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObjectLike.js        | 100.00 |   100.00 |  100.00 |
ℹ  isSymbol.js            | 100.00 |   100.00 |  100.00 |
ℹ  isTypedArray.js        | 100.00 |    60.00 |   50.00 |
ℹ  keys.js                | 100.00 |   100.00 |  100.00 |
ℹ  map.js                 | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isBuffer.js            | 100.00 |    33.33 |    0.00 |
ℹ  isDate.js              | 100.00 |    60.00 |   50.00 |
ℹ  isEmpty.js             | 100.00 |    78.95 |  100.00 |
ℹ  isLength.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObject.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObjectLike.js        | 100.00 |   100.00 |  100.00 |
ℹ  isSymbol.js            | 100.00 |   100.00 |  100.00 |
ℹ  isTypedArray.js        | 100.00 |    60.00 |   50.00 |
ℹ  keys.js                | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isBuffer.js            | 100.00 |    33.33 |    0.00 |
ℹ  isDate.js              | 100.00 |    60.00 |   50.00 |
ℹ  isEmpty.js             | 100.00 |    78.95 |  100.00 |
ℹ  isLength.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObject.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObjectLike.js        | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isBuffer.js            | 100.00 |    33.33 |    0.00 |
ℹ  isDate.js              | 100.00 |    60.00 |   50.00 |
ℹ  isEmpty.js             | 100.00 |    78.95 |  100.00 |
ℹ  isLength.js            | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isBuffer.js            | 100.00 |    33.33 |    0.00 |
ℹ  isDate.js              | 100.00 |    60.00 |   50.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  filter.js              | 100.00 |    80.00 |  100.00 |
ℹ  get.js                 | 100.00 |    80.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isArguments.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLike.js         | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isArrayLikeObject.js   | 100.00 |   100.00 |  100.00 |
ℹ  isBoolean.js           | 100.00 |   100.00 |  100.00 |
ℹ  isBuffer.js            | 100.00 |    33.33 |    0.00 |
ℹ  isDate.js              | 100.00 |    60.00 |   50.00 |
ℹ  isEmpty.js             | 100.00 |    78.95 |  100.00 |
ℹ  isLength.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObject.js            | 100.00 |   100.00 |  100.00 |
ℹ  isObjectLike.js        | 100.00 |   100.00 |  100.00 |
ℹ  isSymbol.js            | 100.00 |   100.00 |  100.00 |
ℹ  isTypedArray.js        | 100.00 |    60.00 |   50.00 |
ℹ  keys.js                | 100.00 |   100.00 |  100.00 |
ℹ  map.js                 | 100.00 |   100.00 |  100.00 |
ℹ  memoize.js             |  96.88 |    72.73 |  100.00 | 45-46
ℹ  reduce.js              | 100.00 |   100.00 |  100.00 |
ℹ  slice.js               |  98.08 |    81.82 |  100.00 | 36
ℹ  toFinite.js            | 100.00 |    87.50 |  100.00 |
ℹ  toInteger.js           | 100.00 |   100.00 |  100.00 |
ℹ  toNumber.js            | 100.00 |    83.33 |  100.00 |
ℹ  toString.js            | 100.00 |    84.62 |  100.00 |
ℹ  upperFirst.js          | 100.00 |   100.00 |  100.00 |
ℹ  words.js               | 100.00 |    88.89 |  100.00 |
ℹ ------------------------------------------------------------------------
ℹ all files               |  99.79 |    86.99 |   93.88 |
ℹ ------------------------------------------------------------------------
ℹ end of coverage report
```

</details>

## Lopullinen arvio tuotantovalmiudesta

Alkuperäinen kirjasto oli täysin testaamaton ja linttaamaton, joten se ei ollut tuotantovalmiudessa laisinkaan. Se sisälsi myös huomattavan määrän erilaisia ongelmia, jotka olisivat varmasti aiheuttaneet ongelmia.

Löydettyjen ongelmien korjaamisen jälkeen kirjaston rivikattavuus on erinomaisella tasolla, mutta haarakattavuudessa on vielä parantamisen varaa, joten oudot syötteet voivat vielä mahdollisesti aiheuttaa ongelmia, nämä ovat kuitenkin ns. edge-caseja, joten uskon että kirjasto on valmist tuotantoon. 
