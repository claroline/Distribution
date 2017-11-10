import React from 'react'

import {t} from '#/main/core/translation'

import {GroupCard} from '#/main/core/administration/user/group/components/group-card.jsx'

const GroupList = {
  definition: [
    {
      name: 'name',
      type: 'string',
      label: t('name'),
      renderer: (rowData) => {
        // variable is used because React will use it has component display name (eslint requirement)
        const groupLink = <a href={`#/groups/${rowData.id}`}>{rowData.name}</a>

        return groupLink
      },
      displayed: true
    }
  ],
  card: GroupCard
}

export {
  GroupList
}
