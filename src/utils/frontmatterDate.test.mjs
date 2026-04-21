import assert from "node:assert/strict";
import { frontmatterDateSchema } from "./frontmatterDate.ts";

function expectParsed(value, expected) {
  const result = frontmatterDateSchema.safeParse(value);

  assert.equal(result.success, true);
  if (!result.success) {
    assert.fail(`Expected "${value}" to parse successfully`);
  }

  assert.ok(result.data instanceof Date);
  assert.equal(result.data.getFullYear(), expected.year);
  assert.equal(result.data.getMonth(), expected.monthIndex);
  assert.equal(result.data.getDate(), expected.day);
}

function expectRejected(value) {
  const result = frontmatterDateSchema.safeParse(value);

  assert.equal(result.success, false);
}

expectParsed("22 04 2026", { year: 2026, monthIndex: 3, day: 22 });
expectParsed("07 01 2025", { year: 2025, monthIndex: 0, day: 7 });
expectRejected("31 02 2026");

const isoResult = frontmatterDateSchema.safeParse("2025-01-07");

assert.equal(isoResult.success, true);
if (!isoResult.success) {
  assert.fail("Expected ISO date string to parse successfully");
}

assert.ok(isoResult.data instanceof Date);
assert.equal(isoResult.data.getTime(), new Date("2025-01-07").getTime());

console.log("frontmatterDate tests passed");
