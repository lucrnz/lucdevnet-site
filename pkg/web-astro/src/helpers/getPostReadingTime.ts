/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import { fromMarkdown } from "mdast-util-from-markdown";

const wordsPerMinute = 170;

type ReadingTimeResult = {
  text: string;
  minutes: number;
};

const adaptResult = (result: ReadingTimeResult): ReadingTimeResult => {
  result.minutes = Math.ceil(result.minutes);
  return result;
};

const getPostReadingTime = (postContentsMarkdown: string): ReadingTimeResult =>
  adaptResult(
    getReadingTime(toString(fromMarkdown(postContentsMarkdown)), {
      wordsPerMinute: wordsPerMinute * 0.9
    })
  );

export default getPostReadingTime;
