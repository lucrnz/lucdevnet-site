import type { BreadCrumbNavigation } from "./breadcrumb";
import type { CommonSEOValues } from "./common-seo";

export type MetaHeadSEO = CommonSEOValues & {
  breadCrumbNavigation: BreadCrumbNavigation;
  isArticle: boolean;
};
