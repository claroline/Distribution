import React from 'react'

import {t} from '#/main/core/translation'

import {UserCard} from '#/main/core/administration/user/user/components/user-card.jsx'

const UserList = {
  definition: [
    {
      name: 'name',
      type: 'string',
      label: t('name'),
      renderer: (rowData) => {
        // variable is used because React will use it has component display name (eslint requirement)
        const userLink = <a href={`#/users/${rowData.id}`}>{rowData.lastName} {rowData.firstName}</a>

        return userLink
      },
      displayed: true
    }, {
      name: 'username',
      type: 'string',
      label: t('username'),
      displayed: true
    }, {
      name: 'firstName',
      type: 'string',
      label: t('first_name')
    }, {
      name: 'lastName',
      type: 'string',
      label: t('last_name')
    }, {
      name: 'hasPersonalWorkspace',
      type: 'boolean',
      label: t('has_personal_workspace'),
      displayed: true
    }, {
      name: 'isEnabled',
      type: 'boolean',
      label: t('isEnabled'),
      displayed: true
    }
  ],
  card: UserCard
}

export {
  UserList
}
