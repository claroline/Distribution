import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'
import {generateUrl} from '#/main/core/api/router'
import {currentUser} from '#/main/core/user/current'
import {ADMIN, getPermissionLevel} from  '#/main/core/workspace/user/restrictions'

import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {User}    from '#/main/core/administration/user/user/components/user.jsx'
import {Users}   from '#/main/core/workspace/user/user/components/users.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'
import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

import {actions} from '#/main/core/workspace/user/user/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {PageAction} from '#/main/core/layout/page'
import {select}  from '#/main/core/workspace/user/selectors'

import {MODAL_DATA_PICKER} from '#/main/core/data/list/modals'

const UserTabActionsComponent = props =>
  <PageActions>
    {getPermissionLevel(currentUser(), props.workspace) === ADMIN &&
      <FormPageActionsContainer
        formName="users.current"
        target={(user, isNew) => isNew ?
          ['apiv2_user_create'] :
          ['apiv2_user_update', {id: user.id}]
        }
        opened={!!matchPath(props.location.pathname, {path: '/users/form'})}
        open={{
          icon: 'fa fa-plus',
          label: trans('add_user'),
          action: '#/users/form'
        }}
        cancel={{
          action: () => navigate('/users')
        }}
      />
    }
    <PageAction
      id='add-role'
      title={trans('add_role')}
      icon={'fa fa-id-badge'}
      disabled={false}
      action={() => props.register(props.workspace)}
      primary={false}
    />
  </PageActions>

UserTabActionsComponent.propTypes = {
  workspace: T.object
}

const ConnectedActions = connect(
  state => ({
    workspace: select.workspace(state)
  }),
  dispatch => ({
    register(workspace) {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-user',
        title: trans('add_user'),
        confirmText: trans('add'),
        name: 'users.picker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_user_list'],
          autoload: true
        },
        handleSelect: (users) => {
          dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
            icon: 'fa fa-fw fa-buildings',
            title: trans('add_roles'),
            confirmText: trans('add'),
            name: 'roles.workspacePicker',
            definition: RoleList.definition,
            card: RoleList.card,
            fetch: {
              url: generateUrl('apiv2_workspace_list_roles', {id: workspace.uuid}),
              autoload: true
            },
            handleSelect: (roles) => {
              roles.forEach(role => dispatch(actions.addUsersToRole(role, users)))
            }
          }))
        }
      }))
    }
  })
)(UserTabActionsComponent)

const UserTabActions = withRouter(ConnectedActions)

const UserTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: Users
      }, {
        path: '/users/form/:id?',
        component: User,
        onEnter: (params) => props.openForm(
          params.id || null,
          props.workspace,
          props.restrictions,
          props.collaboratorRole
        )
      }
    ]}
  />

UserTabComponent.propTypes = {
  openForm: T.func.isRequired,
  workspace: T.object,
  restrictions: T.object,
  collaboratorRole: T.object
}

const UserTab = connect(
  state => ({
    workspace: select.workspace(state),
    restrictions: select.restrictions(state),
    collaboratorRole: select.collaboratorRole(state)
  }),
  dispatch => ({
    openForm(id = null, workspace, restrictions, collaboratorRole) {

      const defaultValue = {
        organization: null, //retreive it with axel stuff
        roles: [collaboratorRole]
      }

      dispatch(actions.open('users.current', id, defaultValue))
    }
  })
)(UserTabComponent)

export {
  UserTabActions,
  UserTab
}
