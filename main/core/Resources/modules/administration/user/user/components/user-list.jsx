import React from 'react'

import {t} from '#/main/core/translation'

import {UserCard} from '#/main/core/administration/user/user/components/user-card.jsx'

const UserList = {
  definition: [
    {
      name: 'username',
      type: 'string',
      label: t('username'),
      renderer: (rowData) => {
        // variable is used because React will use it has component display name (eslint requirement)
        const userLink = <a href={`#/users/${rowData.id}`}>{rowData.username}</a>

        return userLink
      },
      displayed: true
    }, {
      name: 'lastName',
      type: 'string',
      label: t('last_name'),
      displayed: true
    }, {
      name: 'firstName',
      type: 'string',
      label: t('first_name'),
      displayed: true
    }, {
      name: 'meta.hasPersonalWorkspace',
      alias: 'hasPersonalWorkspace',
      type: 'boolean',
      label: t('has_personal_workspace'),
      displayed: true
    }, {
      name: 'meta.enabled',
      alias: 'isEnabled',
      type: 'boolean',
      label: t('user_enabled'),
      displayed: true
    }, {
      name: 'meta.created',
      type: 'date',
      alias: 'created',
      label: t('creation_date')
    }
  ],
  card: UserCard
}

export {
  UserList
}
