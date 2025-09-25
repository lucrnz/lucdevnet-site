/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum DateTimeFormattingConfig {
  MonthYearOnly = 0,
  DayShortMonthYear = 1,
  MonthLongDayNumeric = 2,
  DayNumericMonthLongYearFull = 3,
  FullDateTime = 4,
  MonthLongYearOnly = 5
}

type DateTimeFormattingOptions = {
  locale: string;
  options: Intl.DateTimeFormatOptions;
  replacer?: (arg1: string) => string;
};

const configMonthYearOnly: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    month: "short",
    year: "numeric"
  }
};

const configDayShortMonthYear: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    day: "numeric",
    month: "short",
    year: "numeric"
  }
};

const configMonthLongDayNumeric: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    day: "numeric",
    month: "long"
  }
};

const configDayNumericMonthLongYearFull: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    day: "numeric",
    month: "long",
    year: "numeric"
  }
};

const configFullDateTime: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  },
  replacer: (x: string) => x.replace("at", "-")
};

const configMonthLongYearOnly: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    month: "long",
    year: "numeric"
  }
};

const configEnumMap: {
  [key in DateTimeFormattingConfig]: DateTimeFormattingOptions;
} = {
  [DateTimeFormattingConfig.MonthYearOnly]: configMonthYearOnly,
  [DateTimeFormattingConfig.DayShortMonthYear]: configDayShortMonthYear,
  [DateTimeFormattingConfig.MonthLongDayNumeric]: configMonthLongDayNumeric,
  [DateTimeFormattingConfig.DayNumericMonthLongYearFull]:
    configDayNumericMonthLongYearFull,
  [DateTimeFormattingConfig.FullDateTime]: configFullDateTime,
  [DateTimeFormattingConfig.MonthLongYearOnly]: configMonthLongYearOnly
};

const defaultConfig = configDayNumericMonthLongYearFull;

export const formatDateTime = (
  date: Date,
  config: DateTimeFormattingOptions | DateTimeFormattingConfig = defaultConfig,
  timeZone: string = "UTC"
) => {
  const applyConfig = (config: DateTimeFormattingOptions) => {
    const { locale, options, replacer } = config;
    let result = date.toLocaleDateString(locale, { ...options, timeZone });

    if (replacer) {
      result = replacer(result);
    }

    return result;
  };

  if (typeof config === "number") {
    return applyConfig(configEnumMap[config]);
  }

  return applyConfig(config);
};
