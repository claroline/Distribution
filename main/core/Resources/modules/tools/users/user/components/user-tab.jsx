import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors} from '#/main/core/tools/users/store'
import {actions} from '#/main/core/tools/users/user/store'
import {Users} from '#/main/core/tools/users/user/components/users'
import {User} from '#/main/core/tools/users/user/components/user'
import {UserList} from '#/main/core/user/components/list'
import {constants as toolConstants} from '#/main/core/tool/constants'

const UserTabComponent = props => <Routes
  path={props.path}
  routes={[
    {
      path: '/users',
      exact: true,
      component: Users,
      disabled: props.context !== toolConstants.TOOL_WORKSPACE
    }, {
      path: '/users/form/:id?',
      component: User,
      disabled: props.context !== toolConstants.TOOL_WORKSPACE,
      onEnter: (params) => props.openForm(params.id || null, props.collaboratorRole)
    },
    {
      path: '/contacts',
      render: () => {
        const Contacts = (
          <UserList
            url={['apiv2_users_picker_list']}
            name={selectors.STORE_NAME + '.profile.contacts'}
          />
        )

        return Contacts
      },
      disabled: props.context !== toolConstants.TOOL_DESKTOP
    }
  ]}
/>

UserTabComponent.propTypes = {
  path: T.string.isRequired,
  context: T.string.isRequired,
  openForm: T.func.isRequired,
  collaboratorRole: T.object
}

const UserTab = connect(
  state => ({
    path: toolSelectors.path(state),
    context: toolSelectors.contextType(state),
    collaboratorRole: toolSelectors.contextType(state) === toolConstants.TOOL_WORKSPACE ? toolSelectors.contextData(state).roles.find(role => role.translationKey === 'collaborator'): toolConstants.TOOL_DESKTOP
  }),
  dispatch => ({
    openForm(id = null, collaboratorRole) {
      dispatch(actions.open(selectors.STORE_NAME + '.users.current', id, {
        organization: null, // retrieve it with axel stuff
        roles: [collaboratorRole]
      }))
    }
  })
)(UserTabComponent)

export {
  UserTab
}
