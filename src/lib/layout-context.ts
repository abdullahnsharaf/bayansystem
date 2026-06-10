export interface AppBreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppLayoutMeta {
  title: string;
  pageTitle?: string;
  hideChrome?: boolean;
  breadcrumbs?: AppBreadcrumbItem[];
}
