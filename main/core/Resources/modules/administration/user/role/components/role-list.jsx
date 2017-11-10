import React from 'react'

import {t} from '#/main/core/translation'

import {enumRole} from '#/main/core/administration/user/role/constants'
import {RoleCard} from '#/main/core/administration/user/role/components/role-card.jsx'

const RoleList = {
  definition: [
    {
      name: 'name',
      type: 'string',
      label: t('name'),
      displayed: true
    }, {
      name: 'type',
      type: 'enum',
      label: t('type'),
      options: {
        choices: enumRole
      },
      displayed: true
    }, {
      name: 'translationKey',
      type: 'string', // todo should be a new data type translated
      label: t('translation'),
      renderer: (rowData) => t(rowData.translationKey),
      displayed: true
    }
  ],
  card: RoleCard
}

export {
  RoleList
}
