import React from 'react'

import {t} from '#/main/core/translation'

import {enumRole} from '#/main/core/administration/user/role/constants'
import {RoleCard} from '#/main/core/administration/user/role/components/role-card.jsx'

const RoleList = {
  definition: [
    {
      name: 'name',
      type: 'string',
      label: t('code'),
      displayed: true,
      renderer: (rowData) => {
        // variable is used because React will use it has component display name (eslint requirement)
        const roleLink = <a href={`#/roles/${rowData.id}`}>{rowData.name}</a>

        return roleLink
      }
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
