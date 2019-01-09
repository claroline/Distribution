import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {ListData} from '#/main/app/content/list/containers/data'

import {select} from '#/main/core/workspace/user/selectors'
import {RoleList} from '#/main/core/workspace/user/role/components/role-list'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

const RolesList = props =>
  <ListData
    name="roles.list"
    fetch={{
      url: ['apiv2_workspace_list_roles', {id: props.workspace.uuid}],
      autoload: true
    }}
    primaryAction={RoleList.open}
    delete={{
      url: ['apiv2_role_delete_bulk'],
      disabled: rows => !!rows.find(row => row.name && (row.name.indexOf('COLLABORATOR') > -1 || row.name.indexOf('MANAGER') > -1))
    }}
    definition={RoleList.definition}
    card={RoleList.card}
  />

RolesList.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired
}

const Roles = connect(
  state => ({workspace: select.workspace(state)}),
  null
)(RolesList)

export {
  Roles
}
