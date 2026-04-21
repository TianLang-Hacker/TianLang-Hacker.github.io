import { z } from "astro/zod";

const DD_MM_YYYY_PATTERN = /^(\d{2})\s+(\d{2})\s+(\d{4})$/;

function parseDdMmYyyyDateString(value: string): Date | undefined {
  const match = DD_MM_YYYY_PATTERN.exec(value);
  if (!match) {
    return undefined;
  }

  const [, dayString, monthString, yearString] = match;
  const day = Number(dayString);
  const month = Number(monthString);
  const year = Number(yearString);

  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime())
    || date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export function normalizeFrontmatterDateValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  if (!DD_MM_YYYY_PATTERN.test(trimmedValue)) {
    return value;
  }

  return parseDdMmYyyyDateString(trimmedValue) ?? new Date(Number.NaN);
}

export const frontmatterDateSchema = z.preprocess(normalizeFrontmatterDateValue, z.coerce.date());
