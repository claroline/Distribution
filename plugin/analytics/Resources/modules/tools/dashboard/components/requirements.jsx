import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'

import {Workspace as WorkspaceType} from '#/main/core/workspace/prop-types'
import {selectors as toolSelectors} from  '#/main/core/tool/store'
import {MODAL_USERS} from '#/main/core/modals/users'
import {MODAL_ROLES} from '#/main/core/modals/roles'

import {actions, selectors} from '#/plugin/analytics/tools/dashboard/store'

const RequirementsComponent = (props) =>
  <FormSections
    level={3}
  >
    <FormSection
      id="roles-section"
      key="roles-section"
      icon="fa fa-fw fa-id-badge"
      title={trans('roles')}
      actions={[
        {
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-plus',
          label: trans('add_roles'),
          modal: [MODAL_ROLES, {
            url: ['apiv2_workspace_list_roles', {id: props.workspace.uuid}],
            title: trans('add_roles'),
            selectAction: (selectedRoles) => ({
              type: CALLBACK_BUTTON,
              label: trans('create', {}, 'actions'),
              callback: () => props.addRoles(props.workspace, selectedRoles)
            })
          }]
        }
      ]}
    >
      <ListData
        name={selectors.STORE_NAME + '.requirements.roles'}
        fetch={{
          url: ['apiv2_workspace_requirements_roles_list', {workspace: props.workspace.uuid}],
          autoload: true
        }}
        delete={{
          url: ['apiv2_workspace_requirements_delete', {workspace: props.workspace.uuid}]
        }}
        definition={[
          {
            name: 'role.translationKey',
            type: 'string',
            label: trans('role'),
            displayed: true,
            primary: true,
            calculated: (row) => trans(row.role.translationKey)
          }
        ]}
      />
    </FormSection>
    <FormSection
      id="users-section"
      key="users-section"
      icon="fa fa-fw fa-user"
      title={trans('users')}
      actions={[
        {
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-plus',
          label: trans('add_users'),
          modal: [MODAL_USERS, {
            url: ['apiv2_workspace_list_users', {id: props.workspace.uuid}],
            title: trans('add_users'),
            selectAction: (selectedUsers) => ({
              type: CALLBACK_BUTTON,
              label: trans('create', {}, 'actions'),
              callback: () => props.addUsers(props.workspace, selectedUsers)
            })
          }]
        }
      ]}
    >
      <ListData
        name={selectors.STORE_NAME + '.requirements.users'}
        fetch={{
          url: ['apiv2_workspace_requirements_users_list', {workspace: props.workspace.uuid}],
          autoload: true
        }}
        delete={{
          url: ['apiv2_workspace_requirements_delete', {workspace: props.workspace.uuid}]
        }}
        definition={[
          {
            name: 'userName',
            type: 'string',
            label: trans('user'),
            displayed: true,
            primary: true,
            calculated: (row) => `${row.user.lastName} ${row.user.firstName}`
          }
        ]}
      />
    </FormSection>
  </FormSections>

RequirementsComponent.propTypes = {
  workspace: T.shape(WorkspaceType.propTypes).isRequired,
  addRoles: T.func.isRequired,
  addUsers: T.func.isRequired
}

const Requirements = connect(
  (state) => ({
    workspace: toolSelectors.contextData(state)
  }),
  (dispatch) => ({
    addRoles(workspace, roles) {
      dispatch(actions.createRequirementsForRoles(workspace, roles))
    },
    addUsers(workspace, users) {
      dispatch(actions.createRequirementsForUsers(workspace, users))
    }
  })
)(RequirementsComponent)

export {
  Requirements
}
