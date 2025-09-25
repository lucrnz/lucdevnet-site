/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export default (variableName: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(
    `--${variableName}`
  );
