/**
 * This script runs the tests and generates a code coverage report in LCOV format.
 * The report is saved to the `coverage/lcov.info` file and printed to the console.
 * The `coverageInclude` option specifies which files to include in the coverage report,
 *  while the `coverageExcludeGlobs` option specifies which files to exclude.
 */

import { createWriteStream, mkdirSync } from "node:fs";
import { run } from "node:test";
import { lcov, spec } from "node:test/reporters";

const stream = run({
  coverage: true,
  coverageInclude: ["src/*.js"],
  coverageExcludeGlobs: ["src/.internal/*", "tests/*"],
});

stream.on("test:fail", () => {
  process.exitCode = 1;
});

mkdirSync("coverage", { recursive: true });

stream.compose(spec).pipe(process.stdout);
stream.compose(lcov).pipe(createWriteStream("coverage/lcov.info"));
