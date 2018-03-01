import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {User}    from '#/main/core/administration/user/user/components/user.jsx'
import {Users}   from '#/main/core/workspace/user/user/components/users.jsx'
import {actions} from '#/main/core/workspace/user/user/actions'
import {select}  from '#/main/core/workspace/user/selectors'

const UserTabActionsComponent = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="users.current"
      target={(user, isNew) => isNew ?
        ['apiv2_user_create'] :
        ['apiv2_user_update', {id: user.id}]
      }
      opened={!!matchPath(props.location.pathname, {path: '/users/form'})}
      open={{
        icon: 'fa fa-plus',
        label: t('add_user'),
        action: '#/users/form'
      }}
      cancel={{
        action: () => navigate('/users')
      }}
    />
  </PageActions>

UserTabActionsComponent.propTypes = {
}

const UserTabActions = withRouter(UserTabActionsComponent)

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
  openForm: T.func.isRequired
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
