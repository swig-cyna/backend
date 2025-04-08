import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const user = ac.newRole({
  user: [],
})

export const support = ac.newRole({
  user: ["list"],
})

export const admin = ac.newRole({
  ...adminAc.statements,
  user: ["list"],
})

export const superadmin = ac.newRole({
  ...adminAc.statements,
})
