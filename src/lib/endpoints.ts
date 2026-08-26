/**
 * Global Feature Module Routing Contract
 * Maps business operations to their self-contained API strings
 */
export const API_ROUTES = {
  // Module: General / Health Operations
  health: "/",

  // Feature: Auth (Colocated under features/Auth/services)
  auth: {
    otpRequest: "/auth/otp/request",
    otpVerify: "/auth/otp/verify",
    signup: "/auth/signup",
    signin: "/auth/signin",
    profile: "/auth/profile",
    logout: "/auth/logout",
    changePassword: "/auth/change-password",
    changeEmail: "/auth/change-email",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    refresh: "/auth/refresh",
  },

  addresses: {
    getAll: "/user/buyer/addresses",
    getOne: (id: string) => `/user/buyer/addresses/${id}`,
    create: "/user/buyer/addresses",
    update: (id: string) => `/user/buyer/addresses/${id}`,
    delete: (id: string) => `/user/buyer/addresses/${id}`,
  },

  vendor: {
    profile: "/user/vendor/profile",
    categories: "/vendor/category",
    category: (id: string) => `/vendor/category/${id}`,
    items: "/vendor/item",
    item: (id: string) => `/vendor/item/${id}`,
    // Orders
    activeOrders: "/vendor/orders/active",
    orderHistory: "/vendor/orders/history",
    acceptOrder: (id: string) => `/vendor/order/${id}/accept`,
    rejectOrder: (id: string) => `/vendor/order/${id}/reject`,
    updateOrderStatus: (id: string) => `/vendor/order/${id}/status`,
    // Analytics
    analytics: "/vendor/analytics",
  },

  rider: {
    profile: "/user/rider/profile",
    location: "/user/rider/location",
    getLocation: "/rider/location",
    availableDeliveries: "/rider/deliveries/available",
    assignedDeliveries: "/rider/deliveries/assigned",
    acceptDelivery: "/rider/deliveries/accept",
    declineDelivery: (id: string) => `/rider/deliveries/${id}/decline`,
    updateDeliveryStatus: (id: string) => `/rider/deliveries/${id}/status`,
    confirmPickup: (id: string) => `/rider/deliveries/${id}/pickup`,
    confirmDelivery: (id: string) => `/rider/deliveries/${id}/deliver`,
    reportIssue: (id: string) => `/rider/deliveries/${id}/issue`,
    earningsHistory: "/rider/earnings",
    earningsSummary: "/rider/earnings/summary",
    payouts: "/rider/payouts",
    requestPayout: "/rider/payouts/request",
  },

  // Add to src/lib/endpoints.ts (inside API_ROUTES)
  product: {
    vendors: "/product/vendors",
    vendorMenu: (id: string) => `/product/vendor/${id}/menu`,
  },

  // Add to src/lib/endpoints.ts (inside API_ROUTES)
  buyer: {
    cart: "/buyer/cart",
    checkout: "/buyer/checkout",
    orders: "/buyer/orders",
    reorder: (id: string) => `/buyer/order/${id}/reorder`,
    review: (id: string) => `/buyer/order/${id}/review`,
  },

  admin: {
    profile: "/user/admin/profile",
    pendingVendors: "/user/admin/pending-vendors",
    approveVendor: (id: string) => `/user/admin/approve-vendor/${id}`,
    pendingRiders: "/user/admin/pending-riders",
    approveRider: (id: string) => `/user/admin/approve-rider/${id}`,
    // Delivery / Rider management
    unassignedOrders: "/rider/admin/unassigned-orders",
    assignedOrders: "/rider/admin/assigned-orders",
    manualAssign: (id: string) => `/rider/admin/deliveries/${id}/manual-assign`,
    autoAssign: (id: string) => `/rider/admin/deliveries/${id}/auto-assign`,
    availableRiders: "/rider/admin/available-riders",
  },

  // buyerAddresses: {
  //   base: '/user/buyer/addresses',
  //   byId: (id: string) => `/user/buyer/addresses/${id}`,
  // },
} as const; // Locked as immutable configurations to prevent downstream runtime edits

// Self-explanatory type check utility
export type ApiRoutesType = typeof API_ROUTES;
