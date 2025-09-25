/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type BreadCrumbItem = {
  title: string;
  urlPath?: string;
};

export type BreadCrumbNavigation = BreadCrumbItem[];
