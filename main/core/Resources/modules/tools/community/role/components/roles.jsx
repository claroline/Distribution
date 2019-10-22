import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

import {RoleCard} from '#/main/core/user/data/components/role-card'
import {selectors} from '#/main/core/tools/community/role/store'

const RolesList = props =>
  <ListData
    name={selectors.LIST_NAME}
    fetch={{
      url: ['apiv2_workspace_list_roles_configurable', {id: props.workspace.uuid}],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      target: `${props.path}/roles/form/${row.id}`
    })}
    delete={{
      url: ['apiv2_role_delete_bulk'],
      disabled: rows => !!rows.find(row => row.name && (row.name.indexOf('COLLABORATOR') > -1 || row.name.indexOf('MANAGER') > -1))
    }}
    definition={[
      {
        name: 'translationKey',
        type: 'translation',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'restrictions.maxUsers',
        type: 'number',
        label: trans('maxUsers'),
        displayed: false
      }
    ]}
    card={RoleCard}
  />

RolesList.propTypes = {
  path: T.string.isRequired,
  workspace: T.shape(WorkspaceTypes.propTypes)
}

const Roles = connect(
  state => ({
    path: toolSelectors.path(state),
    workspace: toolSelectors.contextData(state)
  })
)(RolesList)

export {
  Roles
}