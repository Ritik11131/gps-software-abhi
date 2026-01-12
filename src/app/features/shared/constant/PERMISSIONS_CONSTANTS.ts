export const permissionsList = [
  "Account Statements", //0
  "B2B Admin Group", //1
  "Bank Account Setup", //2
  "CSR Commercial Super User Group", //3
  "CSR Commercial User Group", //4
  "CSR Residential Super User Group", //5
  "CSR Residential User Group", //6
  "Check Product Availability", //7
  "Claims Entry", //8
  "Coop", //9
  "Custom Rug Order Entry", //10
  "Custom Rug Quote", //11
  "Earning Statements", //12
  "Existing Claims Inquiry", //13
  "Existing Order Inquiry", //14
  "Existing Reserves Inquiry", //15
  "Existing Sample Order Inquiry", //16
  "Finance Super User Group", //17
  "Finance User Group", //18
  "IS Super Admin", //19
  "Invoice Inquiry", //20
  "Manage Leads & Lead Center", //21
  "Merchandising", //22
  "Mohawk Infinite Rewards", //23
  "Pay Bills", //24
  "Pricing Download", //25
  "Pricing Visibility & Inquiry", //26
  "Product Management Group", //27
  "Product Manager Group", //28
  "Product Order Entry (Create, Edit & Cancel)", //29
  "Promotions", //30
  "Receivables Inquiry", //31
  "Retail Storefront Locator", //32
  "Sales Ops Group", //33
  "Sales Rep Group", //34
  "Sample Order Entry", //35
  "Special Goods", //36
  "View Bank Account", //37
  "View Payment Group", //38
  "View, Create, Extend & Delete Reserves", //39
  "Mohawk Home User Group", //40
];

export const menuConfigResidential = [
  {
    name: "Products",
    isExternal: false,
    path: "",
    permissions: {
      is: [
        [permissionsList[3]],
        [permissionsList[4]],
        [permissionsList[5]],
        [permissionsList[6]],
        [permissionsList[7]],
        [permissionsList[33]],
        [permissionsList[34]],
        [permissionsList[28]],
        [permissionsList[19]],
        [permissionsList[17]],
        [permissionsList[27]],
        [permissionsList[29]],
      ],
      not: [[permissionsList[18]]],
    },
    personas: {
      isShipToUser: false,
    },
    iconClass: "products-icon",
    subNav: [
      {
        name: "Soft Surface",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Residential Broadloom",
            isExternal: false,
            path: "residential/products?name=Soft Surface&page=Residential Broadloom&type=RESIDENTIAL_BROADLOOM",
          },
          {
            name: "Commercial Broadloom",
            isExternal: false,
            path: "residential/products?name=Soft Surface&page=Commercial Broadloom&type=COMMERCIAL_BROADLOOM",
          },
          {
            name: "Carpet Tile",
            isExternal: false,
            path: "residential/products?name=Soft Surface&page=Carpet Tile&type=CARPET_TILE",
          },
          {
            name: "Pad & Cushion",
            isExternal: false,
            path:
              "residential/products?name=Soft Surface&page=" +
              encodeURIComponent("Pad & Cushion") +
              "&type=PAD_CUSHION",
          },
          {
            name: "Adhesives",
            isExternal: false,
            path: "residential/products?name=Soft Surface&page=Adhesives&type=ADHESIVES_SOFT",
          },
          {
            name: "View All Soft Surface",
            isExternal: false,
            path: "residential/products?name=Soft Surface&page=View All Soft Surface&type=SOFTSURFACE",
          },
        ],
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Hard Surface",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Resilient Vinyl",
            isExternal: false,
            path: "residential/products?name=Hard Surface&page=Resilient Vinyl&type=RESILIENT_VINYL",
          },
          {
            name: "Wood & Laminate",
            isExternal: false,
            path:
              "residential/products?name=Hard Surface&page=" +
              encodeURIComponent("Wood & Laminate") +
              "&type=WOOD_LAMINATE",
          },
          {
            name: "Underlayment",
            isExternal: false,
            path: "residential/products?name=Hard Surface&page=Underlayment&type=UNDERLAYMENT",
          },
          {
            name: "Adhesives",
            isExternal: false,
            path: "residential/products?name=Hard Surface&page=Adhesives&type=ADHESIVES_HARD",
          },
          {
            name: "Care & Maintenance",
            isExternal: false,
            path:
              "residential/products?name=Hard Surface&page=" +
              encodeURIComponent("Care & Maintenance") +
              "&type=CARE_MAINTENANCE",
          },
          {
            name: "View All Hard Surface",
            isExternal: false,
            path: "residential/products?name=Hard Surface&page=View All Hard Surface&type=HARDSURFACE",
          },
        ],
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Tile",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Ceramic",
            isExternal: false,
            path: "residential/products?name=Tile&page=Ceramic&type=CERAMIC",
          },
          {
            name: "Porcelain",
            isExternal: false,
            path: "residential/products?name=Tile&page=Porcelain&type=PORCELAIN",
          },
          {
            name: "Trim and Accents",
            isExternal: false,
            path: "residential/products?name=Tile&page=Trim and Accents&type=TRIM_ACCENTS",
          },
          {
            name: "Natural Stone",
            isExternal: false,
            path: "residential/products?name=Tile&page=Natural Stone&type=NATURAL_STONE",
          },
          {
            name: "Decorative Accessories",
            isExternal: false,
            path: "residential/products?name=Tile&page=Decorative Accessories&type=DECORATIVE_ACCESSORIES",
          },
          {
            name: "Setting Material",
            isExternal: false,
            path: "residential/products?name=Tile&page=Setting Materials&type=SETTING_MATERIALS",
          },
          {
            name: "View All Tile",
            isExternal: false,
            path: "residential/products?name=Tile&page=View All Tile&type=TILE",
          },
        ],
      },
      {
        name: "Merchandising",
        isExternal: false,
        path: "",
        permissions: {
          is: [[permissionsList[22]]],
          not: [],
        },
        subNav: [
          {
            name: "Display",
            isExternal: false,
            path: "residential/products?name=Merchandising&page=Display&type=DISPLAY",
          },
          {
            name: "Display Updates",
            isExternal: false,
            path: "residential/products?name=Merchandising&page=Display Updates&type=DISPLAY_UPDATE",
          },
          {
            name: "Sales Tools",
            isExternal: false,
            path: "residential/products?name=Merchandising&page=Sales Tools&type=SALES_TOOLS",
          },
          {
            name: "Graphics and Stickers",
            isExternal: false,
            path: "residential/products?name=Merchandising&page=Graphics and Stickers&type=GRAPHICS_AND_STICKERS",
          },
          {
            name: "View All Merchandising",
            isExternal: false,
            path: "residential/products?name=Merchandising&page=View All Merchandising&type=MERCHANDISING",
          },
        ],
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Accessories",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Trim and Moldings",
            isExternal: false,
            path: "residential/products?name=Accessories&page=Trim and Moldings&type=TRIM_AND_MOLDINGS",
          },
          {
            name: "Wall Base & Stair Solutions",
            isExternal: false,
            path:
              "residential/products?name=Accessories&page=" +
              encodeURIComponent("Wall Base & Stair Solutions") +
              "&type=WALL_BASE_AND_STAIR_SOLUTIONS",
          },
          /*  {
                        name: "Adhesives",
                        isExternal: false,
path: "residential/products?name=Installation Accessories&page=Adhesives&type=accessories_adhesives",
                      },
                      {
                        name: "Care & Maintenance",
                        isExternal: false,
path: "residential/products?name=Installation Accessories&page=Care & Maintenance&type=accessories_care_and_maintenance",
                      },
                      {
                        name: "Underlayments",
                        isExternal: false,
path: "residential/products?name=Installation Accessories&page=Underlayments&type=accessories_underlayment",
                      },*/
          {
            path:
              "residential/products?name=Accessories&page=" +
              encodeURIComponent("Wall Base & Stair Solutions") +
              "&type=WALL_BASE_AND_STAIR_SOLUTIONS",
          },
          {
            name: "Installation Kits & Tools",
            isExternal: false,
            path:
              "residential/products?name=Accessories&page=" +
              encodeURIComponent("Installation Kits & Tools") +
              "&type=INSTALLATION_KITS_AND_TOOLS",
          },
          {
            name: "View All Accessories",
            isExternal: false,
            path: "residential/products?name=Accessories&page=View All Accessories&type=ACCESSORIES",
          },
        ],
        personas: {
          isShipToUser: false,
        },
      },
      // {
      //   name: "Sample",
      //   isExternal: false,
      //   path: "",
      //   subNav: [
      //     {
      //       name: "Default Sample",
      //       isExternal: false,
      //       path: "residential/products?name=Sample&page=Default Sample&type=DEFAULT_SAMPLE",
      //     },
      //     {
      //       name: "View All Sample",
      //       isExternal: false,
      //       path: "residential/products?name=Sample&page=View All Sample&type=SAMPLE",
      //     },
      //   ],
      // },
      {
        name: "Indoor/Outdoor",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Needlepunch Broadloom",
            isExternal: false,
            path: "residential/products?name=Indoor/Outdoor&page=Needlepunch Broadloom&type=NEEDLEPUNCH_BROADLOOM",
          },
          {
            name: "Needlepunch Tile",
            isExternal: false,
            path: "residential/products?name=Indoor/Outdoor&page=Needlepunch Tile&type=NEEDLEPUNCH_TILE",
          },
          {
            name: "View All Indoor/Outdoor",
            isExternal: false,
            path: "residential/products?name=Indoor/Outdoor&page=Indoor/Outdoor&type=INDOOR_OUTDOOR",
          },
        ],
        personas: {
          isShipToUser: false,
        },
      },
    ],
  },
  {
    name: "Orders",
    isExternal: false,
    path: "",
    iconClass: "orders-icon",
    permissions: {
      is: [[permissionsList[14]], [permissionsList[15]], [permissionsList[39]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: true,
    },
    subNav: [
      {
        name: "Order History",
        isExternal: false,
        path: "residential/orders?page=0",
        permissions: {
          is: [[permissionsList[14]]],
          not: [[permissionsList[28]]],
        },
        personas: {
          isShipToUser: true,
        },
      },
      {
        name: "Reserves",
        isExternal: false,
        path: "residential/orders/reserves",
        permissions: {
          is: [[permissionsList[15]], [permissionsList[39]]],
          not: [],
        },
        personas: {
          isShipToUser: false,
        },
      },
    ],
  },
  {
    name: "Pricing",
    isExternal: false,
    path: "",
    iconClass: "price-icon",
    permissions: {
      is: [[permissionsList[26]], [permissionsList[25]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Search and Download Pricing",
        isExternal: false,
        path: "residential/pricing/price-search",
        permissions: {
          is: [[permissionsList[26]]],
          not: [[permissionsList[28]]],
        },
      },
      {
        name: "Download Price Catalog",
        isExternal: false,
        path: "residential/pricing/price-download",
        permissions: {
          is: [[permissionsList[25]]],
          not: [[permissionsList[28]]],
        },
      },
    ],
  },
  {
    name: "Finance",
    isExternal: false,
    path: "",
    iconClass: "finance-icon",
    permissions: {
      is: [
        [permissionsList[0]],
        [permissionsList[12]],
        [permissionsList[20]],
        [permissionsList[24]],
        // [permissionsList[28]],
        [permissionsList[31]],
        [permissionsList[37]],
        [permissionsList[38]],
      ],
      not: [permissionsList[28]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Account Statements",
        isExternal: false,
        path: "residential/finance/bank/account-statements",
        permissions: {
          is: [[permissionsList[0]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
      },
      {
        name: "Bank Accounts",
        isExternal: false,
        path: "residential/finance/bank/accounts-list",
        permissions: {
          is: [
            [permissionsList[37]],
            // [permissionsList[28]],
            [permissionsList[2]],
          ],
          not: [[permissionsList[33]], [permissionsList[34]]],
        },
      },
      {
        name: "Earning Statements",
        isExternal: false,
        path: "residential/finance/bank/earning-statements",
        permissions: {
          is: [[permissionsList[12]]],
          not: [],
        },
      },
      {
        name: "Invoices",
        isExternal: false,
        path: "residential/finance/invoices",
        permissions: {
          is: [[permissionsList[20]]],
          not: [[permissionsList[28]]],
        },
      },
      {
        name: "Make Payment/Open Receivables",
        isExternal: false,
        path: "residential/finance/payments/receivables",
        permissions: {
          is: [
            [permissionsList[24]],
            [permissionsList[31]],
            [permissionsList[38]],
          ],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
      },
      {
        name: "Daily Payment Report",
        isExternal: false,
        path: "residential/finance/payments/daily-payment-report",
        permissions: {
          is: [[permissionsList[18]], [permissionsList[17]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
            [permissionsList[19]],
            [permissionsList[3]],
            [permissionsList[4]],
            [permissionsList[5]],
            [permissionsList[6]],
          ],
        },
      },
      {
        name: "Scheduled Payments",
        isExternal: false,
        path: "residential/finance/payments/online-payment-history",
        permissions: {
          is: [[permissionsList[38]], [permissionsList[24]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
      },
      {
        name: "Recent Payments",
        isExternal: false,
        path: "residential/finance/payments/recent-payments",
        permissions: {
          is: [[permissionsList[38]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
      },
    ],
  },
  {
    name: "Claims",
    isExternal: false,
    path: "",
    iconClass: "claims-icon",
    permissions: {
      is: [[permissionsList[21]], [permissionsList[8]], [permissionsList[13]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Create A New Claim",
        isExternal: false,
        path: "residential/claims/createclaim",
        permissions: {
          is: [[permissionsList[8]]],
          not: [[permissionsList[18]], [permissionsList[28]]],
        },
      },
      {
        name: "Claims History",
        isExternal: false,
        path: "residential/claims/history",
        permissions: {
          is: [[permissionsList[13]]],
          not: [[permissionsList[28]]],
        },
      },
    ],
  },
  {
    name: "EDI Setup",
    isExternal: true,
    path: "http://b2b.mohawkind.com/edisetup/jsp/AccountValidation.jsp",
    iconClass: "setup-icon",
    permissions: {
      is: [
        [permissionsList[1]],
        [permissionsList[19]],
        [permissionsList[17]],
        [permissionsList[5]],
      ],
      not: [
        [permissionsList[18]],
        [permissionsList[6]],
        [permissionsList[28]],
        [permissionsList[34]],
        [permissionsList[33]],
      ],
    },
    personas: {
      isShipToUser: false,
    },
  },
  {
    name: "Mohawk Home",
    isExternal: true,
    path: "https://www.mohawkhome.com/",
    iconClass: "user-icon",
    permissions: {
      is: [[permissionsList[40]], [permissionsList[5]]],
      not: [],
    },
    personas: {
      isShipToUser: false,
    },
  },
  {
    name: "Special Goods",
    isExternal: true,
    path: "https://www.mohawknet.com/mnet/login.jsp",
    iconClass: "goods-icon",
    permissions: {
      is: [
        [permissionsList[3]],
        [permissionsList[4]],
        [permissionsList[5]],
        [permissionsList[6]],
        [permissionsList[28]],
        [permissionsList[33]],
        [permissionsList[34]],
        [permissionsList[36]],
      ],
      not: [],
      // not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
  },
];

export const menuConfigCommercial = [
  {
    name: "Products",
    isExternal: false,
    path: "",
    iconClass: "products-icon",
    permissions: {
      is: [
        [permissionsList[3]],
        [permissionsList[4]],
        [permissionsList[5]],
        [permissionsList[6]],
        [permissionsList[7]],
        [permissionsList[33]],
        [permissionsList[34]],
        [permissionsList[28]],
        [permissionsList[19]],
        [permissionsList[17]],
        [permissionsList[27]],
        [permissionsList[29]],
      ],
      not: [[permissionsList[18]]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Soft Surface",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Carpet Tile",
            isExternal: false,
            path: "commercial/products?name=Soft Surface&page=Carpet Tile&type=CARPET_TILE",
          },

          {
            name: "Broadloom",
            isExternal: false,
            path: "commercial/products?name=Soft Surface&page=Broadloom&type=BROADLOOM",
          },
          {
            name: "View All Soft Surface",
            isExternal: false,
            path: "commercial/products?name=Soft Surface&page=View All Soft Surface&type=SOFTSURFACE",
          },
        ],
      },
      {
        name: "Hard Surface",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Luxury Vinyl Tile (LVT)",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=Luxury Vinyl Tile (LVT)&type=LVT",
          },
          {
            name: "Rubber",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=Rubber&type=RUBBER",
          },
          {
            name: "Wood",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=Wood&type=WOOD",
          },
          {
            name: "Laminate",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=Laminate&type=LAMINATE",
          },
          {
            name: "Non-Vinyl Resilient",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=Non-Vinyl Resilient&type=NON_VINYL_RESILIENT",
          },
          /* {
                        name: "Heterogeneous Resilient Sheet",
                        isExternal: false,
                        path: "commercial/products?name=Hard Surface&page=Heterogeneous Resilient Sheet&type=HETEROGENEOUS_RESILIENT_SHEET",
                    },
                    {
                        name: "Homogeneous Resilient Sheet",
                        isExternal: false,
                        path: "commercial/products?name=Hard Surface&page=Homogeneous Resilient Sheet&type=HOMOGENEOUS_RESILIENT_SHEET",
                    },*/
          {
            name: "HVT",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=HVT&type=HVT",
          },
          {
            name: "Resilient Sheet",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=Resilient Sheet&type=RESILIENT_SHEET",
          },
          {
            name: "View All Hard Surface",
            isExternal: false,
            path: "commercial/products?name=Hard Surface&page=View All Hard Surface&type=HARDSURFACE",
          },
        ],
      },
      {
        name: "Accessories",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Stair Tread",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=Stair Tread&type=STAIR_TREAD",
          },
          {
            name: "Wall Base",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=Wall Base&type=WALL_BASE",
          },
          {
            name: "Trim And Transition",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=Trim And Transition&type=TRIM_AND_TRANSITION",
          },
          {
            name: "Cushion / Pad",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=Cushion/Pad&type=CUSHION_PAD",
          },
          /* {
                        name: "Adhesives",
                        isExternal: false,
                        path: "commercial/products?name=Accessories&page=Adhesives&type=ADHESIVES",
                    },*/
          {
            name: "Underlayment",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=Underlayment&type=UNDERLAYMENT",
          },
          {
            name: "Adhesives and Sundries",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=Adhesives and Sundries&type=ADHESIVES_SUNDRIES",
          },
          /* {
                        name: "Trim And Moldings",
                        isExternal: false,
                        path: "commercial/products?name=Accessories&page=Trim And Moldings&type=TRIM_AND_MOLDINGS",
                    },*/
          {
            name: "View All Accessories",
            isExternal: false,
            path: "commercial/products?name=Accessories&page=View All Accessories&type=ACCESSORIES",
          },
        ],
      },
      // {
      //   name: "Walk off",
      //   isExternal: false,
      //   path: "",
      //   subNav: [
      //     {
      //       name: "Carpet Tile",
      //       isExternal: false,
      //       path: "commercial/products?name=Walk off&page=Carpet Tile&type=CARPET_TILE",
      //     },
      //     {
      //       name: "View All Walk off",
      //       isExternal: false,
      //       path: "commercial/products?name=Walk off&page=View All Walk off&type=WALKOFFPRODUCT",
      //     },
      //   ],
      // },
      {
        name: "Sample",
        isExternal: false,
        path: "",
        subNav: [
          {
            name: "Default Sample",
            isExternal: false,
            path: "commercial/products?name=Sample&page=Default Sample&type=DEFAULT_SAMPLE",
          },
          {
            name: "View All Sample",
            isExternal: false,
            path: "commercial/products?name=Sample&page=View All Sample&type=SAMPLE",
          },
        ],
      },
    ],
  },
  {
    name: "Orders",
    isExternal: false,
    path: "",
    iconClass: "orders-icon",
    permissions: {
      is: [[permissionsList[14]], [permissionsList[15]], [permissionsList[39]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: true,
    },
    subNav: [
      {
        name: "Order History",
        isExternal: false,
        path: "commercial/orders?page=0",
        permissions: {
          is: [[permissionsList[14]]],
          not: [],
        },
        personas: {
          isShipToUser: true,
        },
      },
      {
        name: "Reserves",
        isExternal: false,
        path: "commercial/orders/reserves",
        permissions: {
          is: [[permissionsList[15]], [permissionsList[39]]],
          not: [],
        },
        personas: {
          isShipToUser: false,
        },
      },
    ],
  },
  {
    name: "Quotes",
    isExternal: false,
    path: "commercial/quotes/quote",
    iconClass: "quotes-icon",
    permissions: {
      is: [[permissionsList[14]], [permissionsList[15]], [permissionsList[39]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
  },
  {
    name: "Pricing",
    isExternal: false,
    path: "",
    iconClass: "price-icon",
    permissions: {
      is: [[permissionsList[26]], [permissionsList[25]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Search and Download Pricing",
        isExternal: false,
        path: "commercial/pricing/price-search",
        permissions: {
          is: [[permissionsList[26]]],
          not: [[permissionsList[28]]],
        },
      },
      {
        name: "Download Price Catalog",
        isExternal: false,
        path: "commercial/pricing/price-download",
        permissions: {
          is: [[permissionsList[25]]],
          not: [[permissionsList[28]]],
        },
      },
    ],
  },
  {
    name: "Finance",
    isExternal: false,
    path: "",
    iconClass: "finance-icon",
    permissions: {
      is: [
        [permissionsList[0]],
        [permissionsList[12]],
        [permissionsList[20]],
        [permissionsList[24]],
        // [permissionsList[28]],
        [permissionsList[31]],
        [permissionsList[37]],
        [permissionsList[38]],
      ],
      not: [permissionsList[28]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Account Statements",
        isExternal: false,
        path: "commercial/finance/bank/account-statements",
        permissions: {
          is: [[permissionsList[0]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Bank Accounts",
        isExternal: false,
        path: "commercial/finance/bank/accounts-list",
        permissions: {
          is: [
            [permissionsList[37]],
            // [permissionsList[28]],
            [permissionsList[2]],
          ],
          not: [[permissionsList[33]], [permissionsList[34]]],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Earning Statements",
        isExternal: false,
        path: "commercial/finance/bank/earning-statements",
        permissions: {
          is: [[permissionsList[12]]],
          not: [],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Invoices",
        isExternal: false,
        path: "commercial/finance/invoices",
        permissions: {
          is: [[permissionsList[20]]],
          not: [[permissionsList[28]]],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Make Payment/Open Receivables",
        isExternal: false,
        path: "commercial/finance/payments/receivables",
        permissions: {
          is: [
            [permissionsList[24]],
            [permissionsList[31]],
            [permissionsList[38]],
          ],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Daily Payment Report",
        isExternal: false,
        path: "commercial/finance/payments/daily-payment-report",
        permissions: {
          is: [[permissionsList[18]], [permissionsList[17]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
            [permissionsList[19]],
            [permissionsList[3]],
            [permissionsList[4]],
            [permissionsList[5]],
            [permissionsList[6]],
          ],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Scheduled Payments",
        isExternal: false,
        path: "commercial/finance/payments/online-payment-history",
        permissions: {
          is: [[permissionsList[38]], [permissionsList[24]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Recent Payments",
        isExternal: false,
        path: "commercial/finance/payments/recent-payments",
        permissions: {
          is: [[permissionsList[38]]],
          not: [
            [permissionsList[28]],
            [permissionsList[33]],
            [permissionsList[34]],
          ],
        },
        personas: {
          isShipToUser: false,
        },
      },
    ],
  },
  {
    name: "Claims",
    isExternal: false,
    path: "",
    iconClass: "claims-icon",
    permissions: {
      is: [[permissionsList[21]], [permissionsList[8]], [permissionsList[13]]],
      not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
    subNav: [
      {
        name: "Create A New Claim",
        isExternal: false,
        path: "commercial/claims/createclaim",
        permissions: {
          is: [[permissionsList[8]]],
          not: [[permissionsList[18]], [permissionsList[28]]],
        },
        personas: {
          isShipToUser: false,
        },
      },
      {
        name: "Claims History",
        isExternal: false,
        path: "commercial/claims/history",
        permissions: {
          is: [[permissionsList[13]]],
          not: [[permissionsList[28]]],
        },
        personas: {
          isShipToUser: false,
        },
      },
    ],
  },
  {
    name: "EDI Setup",
    isExternal: true,
    path: "http://b2b.mohawkind.com/edisetup/jsp/AccountValidation.jsp",
    iconClass: "setup-icon",
    permissions: {
      is: [
        [permissionsList[1]],
        [permissionsList[19]],
        [permissionsList[17]],
        [permissionsList[5]],
      ],
      not: [
        [permissionsList[18]],
        [permissionsList[4]],
        [permissionsList[28]],
        [permissionsList[34]],
        [permissionsList[33]],
      ],
    },
    personas: {
      isShipToUser: false,
    },
  },
  {
    name: "Mohawk Home",
    isExternal: true,
    path: "https://www.mohawkhome.com/",
    iconClass: "user-icon",
    permissions: {
      is: [[permissionsList[40]], [permissionsList[3]]],
      not: [],
    },
    personas: {
      isShipToUser: false,
    },
  },
  {
    name: "Special Goods",
    isExternal: true,
    path: "https://www.mohawknet.com/mnet/login.jsp",
    iconClass: "goods-icon",
    permissions: {
      is: [
        [permissionsList[3]],
        [permissionsList[4]],
        [permissionsList[5]],
        [permissionsList[6]],
        [permissionsList[28]],
        [permissionsList[33]],
        [permissionsList[34]],
        [permissionsList[36]],
      ],
      not: [],
      // not: [[permissionsList[28]]],
    },
    personas: {
      isShipToUser: false,
    },
  },
];
