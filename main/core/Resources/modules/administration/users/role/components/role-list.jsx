import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {enumRole} from '#/main/core/user/role/constants'
import {RoleCard} from '#/main/core/user/data/components/role-card'

import {url} from '#/main/app/api'

const RoleList = {
  open: (row) => ({
    type: LINK_BUTTON,
    target: `/roles/form/${row.id}`,
    label: trans('edit', {}, 'actions')
  }),
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('code'),
      displayed: false,
      primary: true
    }, {
      name: 'translationKey',
      type: 'translation',
      label: trans('name'),
      displayed: true
    }, {
      name: 'type',
      type: 'choice',
      label: trans('type'),
      options: {
        choices: enumRole
      },
      displayed: true
    }, {
      name: 'restrictions.maxUsers',
      type: 'number',
      label: trans('maxUsers'),
      displayed: false
    }, {
      name: 'workspace.name',
      type: 'string',
      label: trans('workspace'),
      displayed: true,
      filterable: false,
      render: (rowData) => {
        let WorkspaceLink

        if (rowData.workspace) {
          //TODO: WORKSPACE OPEN URL CHANGE
          WorkspaceLink = <a href={url(['claro_workspace_open', {workspaceId: rowData.workspace.meta.slug}])}>{rowData.workspace.name}</a>
        } else {
          WorkspaceLink = '-'
        }

        return WorkspaceLink
      }
    }
  ],

  card: RoleCard
}

export {
  RoleList
}
