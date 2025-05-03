// lib/route.ts

export const route = {
  dashboard: {
    wallet: "/dashboard/wallet",
    orders: "/dashboard/buyer/orders",
    favorites: "/dashboard/buyer/favorites",

    settings: "/dashboard/settings",
    help: "/dashboard/help",
  },

  buyer: {
    dashboard: "/dashboard/buyer/home",
    profile: "/dashboard/buyer/profile",
    wallet: "/dashboard/buyer/wallet",
    orders: "/dashboard/buyer/orders",
    favorites: "/dashboard/buyer/favorites",
    payments: "/dashboard/buyer/payments",
    settings: "/dashboard/buyer/settings",
    help: "/dashboard/buyer/help",
  },
  freelancer: {
    dashboard: "/dashboard/freelancer/home",
    profile: "/dashboard/freelancer/profile",
    gigs: "/dashboard/freelancer/gigs",
    gigs_new: "/dashboard/freelancer/gigs-new",
    gigs_edit: (id: string | number) => `/dashboard/freelancer/gigs-edit/${id}`,
    tasks: "/dashboard/freelancer/tasks",
    earnings: "/dashboard/freelancer/earnings",
    feebacks: "/dashboard/freelancer/feebacks",

    payments: "/dashboard/freelancer/payments",
    settings: "/dashboard/freelancer/settings",
    help: "/dashboard/freelancer/help",
  },
  admin: {
    users: "/dashboard/admin/users",
    orders: "/dashboard/admin/orders",
    gigs: "/dashboard/admin/gigs",
    transactions: "/dashboard/admin/transactions",
    supports: "/dashboard/admin/supports",
  },
  settings: {
    account: "/dashboard/settings/account",
    payments: "/dashboard/settings/payments",
    security: "/dashboard/settings/security",
  },
  public: {
    home: "/",

    gigs: "/gigs",
    gig_detail: (id: string | number) => `/gigs/${id}`,

    categories: "/categories",
    category_detail: (slug: string) => `/categories/${slug}`,

    help: "/help",

    search: "/search",
    login: "/auth/login",
    register: "/auth/signup",
    forgot_password: "/auth/password/forgot",

    freelancer_signup: "/freelancer/signup",
  },
};
