/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type LinkSection = "main" | "resume";

export type LinkData = {
  name: string;
  url: string;
  section?: LinkSection;
};
