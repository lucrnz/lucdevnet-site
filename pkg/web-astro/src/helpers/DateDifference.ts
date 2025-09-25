/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface DateTimeDifference {
  years: number;
  months: number;
  days: number;
}

/* @preserve
  This is from https://stackoverflow.com/a/49201872 - CC-BY-SA 4.0
*/
export function dateDifference(
  startDate: Date,
  endDate: Date
): DateTimeDifference {
  const startYear = startDate.getFullYear();
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }

  return {
    years: yearDiff,
    months: monthDiff,
    days: dayDiff
  };
}

export function roundDateDifference(diff: DateTimeDifference) {
  let { years, months, days } = diff;

  // Round up months if necessary
  if (months >= 11) {
    years += 1;
    months = 0;
  }

  // Round up days if necessary
  if (days >= 25) {
    months += 1;
    days = 0;
    if (months >= 11) {
      years += 1;
      months = 0;
    }
  }

  // Special cases
  if (months >= 11 && days >= 25) {
    years += 1;
    months = 0;
    days = 0;
  }

  return { years, months, days } as DateTimeDifference;
}

export function prettyPrintDateDifference(diff: DateTimeDifference) {
  const { years, months } = diff;

  let result = "";
  if (years > 0) {
    if (months > 0) {
      result = `${years} ${years === 1 ? "year" : "years"} and ${months} ${
        months === 1 ? "month" : "months"
      }`;
    } else {
      result = `${years} ${years === 1 ? "year" : "years"}`;
    }
  } else {
    result = months > 1 ? `${months} months` : `${months} month`;
  }

  return result;
}

/**
 * Convenience function - this will calculate date time difference + round it up + pretty print
 */
export const dateTimeDifferenceToString = (start: Date, end: Date) =>
  prettyPrintDateDifference(roundDateDifference(dateDifference(start, end)));

export const printDateTimeDifferenceYears = ({ years }: DateTimeDifference) =>
  years > 1 ? `${years} years` : "1 year";

const normalizeDateTimeDifference = (diff: DateTimeDifference) => {
  const normalized = { ...diff };

  // Normalize days
  if (normalized.days >= 30) {
    normalized.months += Math.floor(normalized.days / 30);
    normalized.days = normalized.days % 30;
  }

  // Normalize months
  if (normalized.months >= 12) {
    normalized.years += Math.floor(normalized.months / 12);
    normalized.months = normalized.months % 12;
  }

  return normalized;
};

export const sumDateTimeDifferences = (
  a: DateTimeDifference,
  b: DateTimeDifference
) =>
  normalizeDateTimeDifference({
    years: a.years + b.years,
    months: a.months + b.months,
    days: a.days + b.days
  });
