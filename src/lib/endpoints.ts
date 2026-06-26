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
    categories: '/vendor/category',
  category: (id: string) => `/vendor/category/${id}`,
  items: '/vendor/item',
  item: (id: string) => `/vendor/item/${id}`,
  // Orders
  activeOrders: '/vendor/orders/active',
  orderHistory: '/vendor/orders/history',
  acceptOrder: (id: string) => `/vendor/order/${id}/accept`,
  rejectOrder: (id: string) => `/vendor/order/${id}/reject`,
  updateOrderStatus: (id: string) => `/vendor/order/${id}/status`,
  // Analytics
  analytics: '/vendor/analytics',
  },

  // Add to src/lib/endpoints.ts under API_ROUTES:
  rider: {
    profile: "/user/rider/profile",
    location: "/user/rider/location",
  },

  // buyerAddresses: {
  //   base: '/user/buyer/addresses',
  //   byId: (id: string) => `/user/buyer/addresses/${id}`,
  // },
} as const; // Locked as immutable configurations to prevent downstream runtime edits

// Self-explanatory type check utility
export type ApiRoutesType = typeof API_ROUTES;
