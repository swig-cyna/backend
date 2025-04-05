export const Roles = {
  USER: "user",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  SUPPORT: "support",
} as const

export const Permissions = {
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_USERS: "manage_users",
  MANAGE_SUPPORT: "manage_support",
  MANAGE_PAYMENTS: "manage_payments",
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_ORDERS: "view_orders",
  MANAGE_SUBSCRIPTIONS: "manage_subscriptions",
  ACCESS_SECURITY_LOGS: "access_security_logs",
  CONTACT_SUPPORT: "contact_support",
} as const

export const RolePermissions = {
  [Roles.USER]: [Permissions.VIEW_ORDERS, Permissions.CONTACT_SUPPORT],
  [Roles.ADMIN]: [
    Permissions.MANAGE_PRODUCTS,
    Permissions.VIEW_DASHBOARD,
    Permissions.MANAGE_SUBSCRIPTIONS,
    Permissions.VIEW_ORDERS,
    Permissions.MANAGE_PAYMENTS,
  ],
  [Roles.SUPERADMIN]: [
    Permissions.MANAGE_PRODUCTS,
    Permissions.MANAGE_USERS,
    Permissions.MANAGE_SUPPORT,
    Permissions.MANAGE_PAYMENTS,
    Permissions.VIEW_DASHBOARD,
    Permissions.ACCESS_SECURITY_LOGS,
  ],
  [Roles.SUPPORT]: [Permissions.MANAGE_SUPPORT, Permissions.VIEW_ORDERS],
}
