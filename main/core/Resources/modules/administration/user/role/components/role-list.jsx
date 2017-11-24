import React from 'react'

import {t} from '#/main/core/translation'

import {enumRole} from '#/main/core/administration/user/role/constants'
import {RoleCard} from '#/main/core/administration/user/role/components/role-card.jsx'

const RoleList = {
  open: {
    action: (row) => `#/roles/${row.id}`
  },
  definition: [
    {
      name: 'name',
      type: 'string',
      label: t('code'),
      displayed: true,
      primary: true
    }, {
      name: 'translationKey',
      type: 'string', // todo should be a new data type translated
      label: t('name'),
      renderer: (rowData) => t(rowData.translationKey),
      displayed: true
    }, {
      name: 'meta.type',
      type: 'enum',
      label: t('type'),
      options: {
        choices: enumRole
      },
      alias: 'type',
      displayed: true
    }
  ],
  card: RoleCard
}

export {
  RoleList
}
