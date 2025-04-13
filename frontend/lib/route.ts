// lib/route.ts

export const route = {
  buyer: {
    dashboard: "/dashboard/buyer/home",
    profile: "/dashboard/buyer/profile",
    orders: "/dashboard/buyer/orders",
    favorites: "/dashboard/buyer/favorites",
    payments: "/dashboard/buyer/payments",
    settings: "/dashboard/buyer/settings",
  },
  freelancer: {
    dashboard: "/dashboard/freelancer/home",
    profile: "/dashboard/freelancer/profile",
    gigs: "/dashboard/freelancer/gigs",
    gigs_new: "/dashboard/freelancer/gigs-new",
    gigs_edit: (id: string | number) => `/dashboard/freelancer/gigs-edit/${id}`,
    orders: "/dashboard/freelancer/orders",
    earnings: "/dashboard/freelancer/earnings",
    payments: "/dashboard/freelancer/payments",
    settings: "/dashboard/freelancer/settings",
  },
  admin: {
    dashboard: "/dashboard/admin/home",
    users: "/dashboard/admin/users",
    gigs: "/dashboard/admin/gigs",
    reports: "/dashboard/admin/reports",

    settings: "/dashboard/admin/settings",
    finance: "/dashboard/admin/finance",

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
