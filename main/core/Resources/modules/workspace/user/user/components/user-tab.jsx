import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {User}    from '#/main/core/administration/user/user/components/user.jsx'
import {Users}   from '#/main/core/workspace/user/user/components/users.jsx'
import {actions} from '#/main/core/workspace/user/user/actions'
import {select}  from '#/main/core/workspace/user/selectors'
import {PageAction} from '#/main/core/layout/page'

import {ADMIN, getPermissionLevel} from  '#/main/core/workspace/user/restrictions'
import {currentUser} from '#/main/core/user/current'

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
      action={() => alert('yolo')}
      primary={false}
    />
  </PageActions>

UserTabActionsComponent.propTypes = {
  location: T.object,
  workspace: T.object
}

const ConnectedActions = connect(
  state => ({
    workspace: select.workspace(state)
  }),
  null
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
