import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {UserCard} from '#/main/core/administration/user/user/components/user-card.jsx'
import {select}  from '#/main/core/workspace/user/selectors'

function getRoles(user) {
    return user.roles.filter(role => true).map(role => role.translationKey).join(',')
}

function getWorkspaceRoles(workspace)
{
    const roles = {}

    workspace.roles.forEach(role => {
      roles[role.id] = role.translationKey
    })

    return roles
}

function getUserList(workspace)
{
  return {
    open: {
      action: (row) => `#/users/form/${row.id}`
    },
    definition: [
      {
        name: 'username',
        type: 'username',
        label: t('username'),
        displayed: true,
        primary: true
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
        name: 'email',
        alias: 'mail',
        type: 'email',
        label: t('email'),
        displayed: true
      }, {
        name: 'administrativeCode',
        type: 'string',
        label: t('code')
      }, {
        name: 'meta.lastLogin',
        type: 'date',
        alias: 'lastLogin',
        label: t('last_login'),
        displayed: true,
        options: {
          time: true
        }
      }, {
        name: 'roles',
        type: 'enum',
        alias: 'role',
        options: {
          choices: getWorkspaceRoles(workspace)
        },
        label: t('roles'),
        displayed: true,
        filterable: true,
        renderer: (rowData) => getRoles(rowData)
      }
    ],
    card: UserCard
  }
}

export {
  getUserList
}
