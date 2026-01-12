interface BreadcrumbItem {
    name: string;
    path?: string;
    active: boolean;
  }
  
  export interface BreadcrumbItems extends Array<BreadcrumbItem> {}
  