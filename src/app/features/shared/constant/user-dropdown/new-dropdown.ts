import { permissionsList } from "../PERMISSIONS_CONSTANTS";

export const dropdown = [
  {
    name: "My Profile",
    paths: {
      residential: "/residential/my-profile",
      commercial: "/commercial/my-profile",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: true,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: true,
      },
      financialUser: {
        state: true,
        accountInfoRequired: true,
      },
      productManager: {
        state: true,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Your Company",
    paths: {
      residential: "/residential/company/manage-users",
      commercial: "/commercial/company/manage-users",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      salePerson: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      financialUser: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
    },
    permissions: [permissionsList[1]],
  },
  //List Accounts for CSR
  {
    name: "List Accounts",

    paths: {
      residential: "/residential/account/accounts-list",
      commercial: "/commercial/account/accounts-list",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
        accountInfoRequired: false,
        multiAccount: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: false,
      },
      salePerson: {
        state: false,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  //List Accounts for customer
  {
    name: "List Accounts",

    paths: {
      residential: "/residential/account/multi-account",
      commercial: "/commercial/account/multi-account",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
        accountInfoRequired: true,
        multiAccount: true,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: false,
      },
      salePerson: {
        state: false,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Divider",
    divider: true,
  },

  {
    name: "Sales Dashboard",
    paths: {
      residential: "/residential/salesperson",
      commercial: "/commercial/salesperson",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Entitlement manager",
    paths: {
      residential: "/residential/entitlement-manager",
      commercial: "/commercial/entitlement-manager",
    },
    environment: {
      commercial: false,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: true,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: true,
      },
      financialUser: {
        state: false,
        accountInfoRequired: true,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Accounts",
    paths: {
      residential: "/residential/salesperson/view-accounts",
      commercial: "/commercial/salesperson/view-accounts",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: false,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Sample Budget",
    paths: {
      residential: "/residential/sample-budget",
      commercial: "/commercial/sample-budget",
    },
    environment: {
      commercial: false,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: true,
      },
      financialUser: {
        state: false,
        accountInfoRequired: true,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Sample Expense Recovery",
    url: "https://mohawk-carpet.us10.sapanalytics.cloud/sap/fpa/ui/tenants/8d86c/app.html#/home",
    pageUrl: true,
    environment: {
      commercial: false,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: true,
      },
      financialUser: {
        state: false,
        accountInfoRequired: true,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Divider",
    salesDivider: true,
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: false,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Product Catalog",
    paths: {
      residential: "/residential/product-owner",
      commercial: "/commercial/product-owner",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: true,
      },
      financialUser: {
        state: true,
        accountInfoRequired: true,
      },
      productManager: {
        state: true,
        accountInfoRequired: false,
      },
    },
  },

  {
    name: "Mohawk Sales Team",
    popup: true,
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: true,
      },
      financialUser: {
        state: true,
        accountInfoRequired: true,
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Mohawk Today",
    url: "https://mohawktoday.com",
    pageUrl: true,
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: false,
        },
      },
      shipToUser: {
        state: true,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      financialUser: {
        state: true,
        accountInfoRequired: true,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
    },
    permissions: [
      permissionsList[9],
      permissionsList[21],
      permissionsList[23],
      permissionsList[30],
      permissionsList[32],
    ],
  },
  {
    name: "Leads",
    url: "https://mohawktoday.com",
    pageUrl: true,
    // paths: {
    //   //   url not known, defaulting to dashboard
    //   residential: "/residential/salesperson",
    //   commercial: "/commercial/salesperson",
    // },
    environment: {
      commercial: false,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
    },
    permissions: [permissionsList[21]],
  },
  {
    name: "Promotions",
    url: "https://mohawktoday.com",
    pageUrl: true,
    // paths: {
    //   //url not known, defaulting to dashboard
    //   residential: "/residential/salesperson",
    //   commercial: "/commercial/salesperson",
    // },
    environment: {
      commercial: false,
      residential: true,
    },
    personas: {
      customer: {
        state: false,
      },
      default: {
        state: false,
        accountInfoRequired: false,
      },
      csr: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      shipToUser: {
        state: false,
      },
      financialAdmin: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      financialUser: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
      productManager: {
        state: false,
        accountInfoRequired: false,
        ignorePermissions: true,
        environment: {
          commercial: true,
          residential: true,
        },
      },
    },
    permissions: [permissionsList[30]],
  },
  {
    name: "Divider",
    divider: true,
  },
  {
    name: "Contact Us / Support",
    paths: {
      residential: "/residential/contact-us",
      commercial: "/commercial/contact-us",
    },
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: true,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: true,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: true,
      },
      financialUser: {
        state: true,
        accountInfoRequired: true,
      },
      productManager: {
        state: true,
        accountInfoRequired: false,
      },
    },
  },
  {
    name: "Divider",
    divider: true,
  },
  {
    name: "Sign Out",
    logout: true,
    environment: {
      commercial: true,
      residential: true,
    },
    personas: {
      customer: {
        state: true,
      },
      default: {
        state: true,
        accountInfoRequired: false,
      },
      csr: {
        state: true,
        accountInfoRequired: true,
      },
      salePerson: {
        state: true,
        accountInfoRequired: false,
      },
      shipToUser: {
        state: true,
      },
      financialAdmin: {
        state: true,
        accountInfoRequired: false,
      },
      financialUser: {
        state: true,
        accountInfoRequired: false,
      },
      productManager: {
        state: true,
        accountInfoRequired: false,
      },
    },
  },
];
