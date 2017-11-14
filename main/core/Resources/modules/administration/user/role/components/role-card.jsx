import React from 'react'

import {enumRole} from '#/main/core/administration/user/role/constants'

const RoleCard = (row) => ({
  onClick: `#/roles/${row.id}`,
  poster: null,
  icon: 'fa fa-id-badge',
  title: row.name,
  subtitle: enumRole[row.type]
})

export {
  RoleCard
}
