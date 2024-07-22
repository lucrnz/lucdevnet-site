export enum DateTimeFormattingConfig {
  MonthYearOnly = 0,
  DayShortMonthYear = 1
}

type DateTimeFormattingOptions = {
  locale: string;
  options: Intl.DateTimeFormatOptions;
  replacer?: (arg1: string) => string;
};

const ConfigMonthYearOnly: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    month: "short",
    year: "numeric"
  }
};

const ConfigDayShortMonthYear: DateTimeFormattingOptions = {
  locale: "en-US",
  options: {
    day: "numeric",
    month: "short",
    year: "numeric"
  },
  replacer: (dateString: string) => dateString.replace(",", " ")
};

const configEnumMap: {
  [key in DateTimeFormattingConfig]: DateTimeFormattingOptions;
} = {
  [DateTimeFormattingConfig.MonthYearOnly]: ConfigMonthYearOnly,
  [DateTimeFormattingConfig.DayShortMonthYear]: ConfigDayShortMonthYear
};

const defaultConfig = ConfigDayShortMonthYear;

export const formatDateTime = (
  date: Date,
  config: DateTimeFormattingOptions | DateTimeFormattingConfig = defaultConfig,
  timeZone = "UTC"
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
