/*
 * SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BreadCrumbNavigation } from "./breadcrumb";
import type { CommonSEOValues } from "./common-seo";

export type MetaHeadSEO = CommonSEOValues & {
  breadCrumbNavigation: BreadCrumbNavigation;
  isArticle: boolean;
};
