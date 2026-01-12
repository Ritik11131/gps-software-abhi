import { permissionsList } from "./PERMISSIONS_CONSTANTS";

export const MASHUP_CONSTANTS = [
  "/residential?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/residential/orders?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/residential/my-profile/notification-preferences?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/residential/claims/history?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/residential/claims/createclaim?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/residential/product-owner?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/commercial?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/commercial/orders?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/commercial/claims/history?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/commercial/claims/createclaim?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/commercial/my-profile/notification-preferences?email={UID}&accountNumber={ACCOUNTNUMBER}",
  "/commercial/product-owner?email={UID}&accountNumber={ACCOUNTNUMBER}",
];

export const Permissions_CONSTANTS = [
  {
    url: "/residential",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/account/search",
    permissions: {
      is: [[permissionsList[4]]],
      not: [],
    },
  },
  {
    url: "/residential/orders",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/order-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/orders-history-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/order-details-edit/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/cancel-order/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/product-removed/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/reserves/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/orders/reserves-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/pricing",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/pricing/price-search/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/pricing/price-download/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/choose-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/change-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/shipping-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/order-samples/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/select-color/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/share-via-email/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/companion-products/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/products/products-compare/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/user/add/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/user/details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/user/manage-user/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/user/edit-user/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/my-profile/profile/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/my-profile/billing-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/my-profile/default-front-store/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/my-profile/email-subscriptions/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/my-profile/order-notification/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/my-profile/shipping-preferences/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/salesperson/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/territory-manager/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/rvp/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/sales-ops/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/district-manager/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/svp/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/product-owner/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/home/contact-us/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/make-payment/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/receivables/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/review/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/recent-payments/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/scheduled/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/scheduled-payment-confirmation/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/payments/online-payment-history/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/bank/add-account/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/bank/edit-account/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/bank/accounts-list/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/bank/earning-statements/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/bank/account-statements/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/finance/bank/account-statement-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/company",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/company/manage-users/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/company/add-new-user/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/company/manage-users/id/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/company/manage-users/id/edit/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/createclaim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/history/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/freight-claim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/createclaim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/createclaim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/pricing-billing-error/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/tax-billing-error/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/accommodation-return/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/customer-satisfaction/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/mohawk-order-error/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/defective-product/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/wrong-product/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/damaged/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/wrong-quantity-shortage/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/cancellation-fees/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/new-claim-added/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/new-claim-installed/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/claims/claimType/confirmation/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/cart",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/residential/cart/empty/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },

  // commercial Permission Guard

  {
    url: "/commercial",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/account/search",
    permissions: {
      is: [[permissionsList[4]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/order-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/orders-history-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/order-details-edit/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/cancel-order/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/product-removed/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/reserves/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/orders/reserves-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/pricing",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/pricing/price-search/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/pricing/price-download/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/choose-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/change-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/shipping-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/order-samples/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/select-color/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/share-via-email/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/companion-products/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/products/products-compare/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/user/add/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/user/details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/user/manage-user/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/user/edit-user/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/my-profile/profile/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/my-profile/billing-address/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/my-profile/default-front-store/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/my-profile/email-subscriptions/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/my-profile/order-notification/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/my-profile/shipping-preferences/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/salesperson/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/territory-manager/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/rvp/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/sales-ops/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/district-manager/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/svp/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/product-owner/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/home/contact-us/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/make-payment/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/receivables/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/review/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/recent-payments/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/scheduled/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/scheduled-payment-confirmation/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/payments/online-payment-history/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/bank/add-account/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/bank/edit-account/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/bank/accounts-list/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/bank/earning-statements/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/bank/account-statements/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/finance/bank/account-statement-details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/company",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/company/manage-users/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/company/add-new-user/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/company/manage-users/id/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/company/manage-users/id/edit/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/createclaim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/history/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/details/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/freight-claim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/createclaim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/createclaim/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/pricing-billing-error/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/tax-billing-error/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/accommodation-return/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/customer-satisfaction/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/mohawk-order-error/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/defective-product/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/wrong-product/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/damaged/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/wrong-quantity-shortage/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/cancellation-fees/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/new-claim-added/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/new-claim-installed/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/claims/claimType/confirmation/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/cart",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/cart/empty/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
  {
    url: "/commercial/quote/request-quote/{VARIABLE}",
    permissions: {
      is: [[permissionsList[0]], [permissionsList[1]], [permissionsList[2]]],
      not: [],
    },
  },
];
