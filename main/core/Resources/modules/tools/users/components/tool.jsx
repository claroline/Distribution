import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {matchPath, Routes} from '#/main/app/router'

import {Profile} from '#/main/core/user/profile/containers/main.jsx'
import {User as UserType} from '#/main/core/user/prop-types'
import {Workspace as WorkspaceType} from '#/main/core/workspace/prop-types'
import {constants} from '#/main/core/tools/users/constants'
import {getPermissionLevel} from  '#/main/core/tools/users/restrictions'
import {UserTab} from '#/main/core/tools/users/user/components/user-tab'
import {GroupTab} from '#/main/core/tools/users/group/components/group-tab'
import {RoleTab} from '#/main/core/tools/users/role/components/role-tab'
import {ParametersTab} from '#/main/core/tools/users/parameters/components/parameters-tab'
import {PendingTab} from '#/main/core/tools/users/pending/components/pending-tab'
import {ToolPage} from '#/main/core/tool/containers/page'
import {constants as toolConstants} from '#/main/core/tool/constants'

const UsersTool = (props) => {
  const permLevel = getPermissionLevel(props.workspace, props.currentUser)
  const pathName = props.location.pathname
  const regExp = new RegExp('/desktop/users/profile/([^/]*)')
  const match = pathName.match(regExp)
  const publicUrl = match ? pathName.match(regExp)[1]: null

  const redirect = props.context === toolConstants.TOOL_WORKSPACE ?
    {from: '/', exact: true, to: '/users'}:
    {from: '/', exact: true, to: '/contacts'}

  return (
    <ToolPage
      actions={[
        {
          name: 'register_users',
          type: CALLBACK_BUTTON,
          label: trans('register_users'),
          icon: 'fa fa-plus',
          callback: () => props.registerUsers(props.workspace),
          primary: true,
          displayed: props.context === toolConstants.TOOL_WORKSPACE && !props.workspace.meta.model &&
            matchPath(props.location.pathname, {path: `${props.path}/users`, exact: true}) &&
            (permLevel === constants.MANAGER || permLevel === constants.ADMIN)
        }, {
          name: 'create_user',
          type: LINK_BUTTON,
          label: trans('create_user'),
          icon: 'fa fa-pencil',
          target: `${props.path}/users/form`,
          displayed: props.context === toolConstants.TOOL_WORKSPACE && !props.workspace.meta.model &&
            matchPath(props.location.pathname, {path: `${props.path}/users`, exact: true}) &&
            permLevel === constants.ADMIN
        }, {
          name: 'register_groups',
          type: CALLBACK_BUTTON,
          label: trans('register_groups'),
          icon: 'fa fa-plus',
          callback: () => props.registerGroups(props.workspace),
          primary: true,
          displayed: props.context === toolConstants.TOOL_WORKSPACE && !props.workspace.meta.model &&
            matchPath(props.location.pathname, {path: `${props.path}/groups`, exact: true}) &&
            (permLevel === constants.MANAGER || permLevel === constants.ADMIN)
        }, {
          name: 'create_group',
          type: LINK_BUTTON,
          label: trans('create_group'),
          icon: 'fa fa-pencil',
          target: `${props.path}/groups/form`,
          displayed: props.context === toolConstants.TOOL_WORKSPACE && !props.workspace.meta.model &&
            matchPath(props.location.pathname, {path: `${props.path}/groups`, exact: true}) &&
            permLevel === constants.ADMIN
        }, {
          name: 'add_role',
          type: LINK_BUTTON,
          label: trans('add_role'),
          icon: 'fa fa-plus',
          target: `${props.path}/roles/form`,
          primary: true,
          displayed: props.context === toolConstants.TOOL_WORKSPACE && matchPath(props.location.pathname, {path: `${props.path}/roles`, exact: true}) &&
            permLevel !== constants.READ_ONLY
        }
      ]}
      subtitle={
        <Routes
          path={props.path}
          routes={[
            {
              path: '/users',
              render: () => trans('users')
            }, {
              path: '/groups',
              render: () => trans('groups'),
              disabled: props.context !== toolConstants.TOOL_WORKSPACE
            }, {
              path: '/roles',
              render: () => trans('roles'),
              disabled: props.context !== toolConstants.TOOL_WORKSPACE
            }, {
              path: '/pending',
              render: () => trans('pending_registrations'),
              disabled: props.context !== toolConstants.TOOL_WORKSPACE
            }, {
              path: '/parameters',
              render: () => trans('parameters'),
              disabled: props.context !== toolConstants.TOOL_WORKSPACE
            }
          ]}
        />
      }
    >
      <Routes
        path={props.path}
        redirect={[
          redirect
        ]}
        routes={[
          {
            path: '/users',
            component: UserTab,
            disabled: props.context !== toolConstants.TOOL_WORKSPACE && props.workspace.meta && props.workspace.meta.model
          }, {
            path: '/groups',
            component: GroupTab,
            disabled:  props.context !== toolConstants.TOOL_WORKSPACE && props.workspace.meta && props.workspace.meta.model
          }, {
            path: '/roles',
            component: RoleTab,
            disabled: permLevel === constants.READ_ONLY && props.context !== toolConstants.TOOL_WORKSPACE
          }, {
            path: '/pending',
            component: PendingTab,
            disabled: props.workspace && permLevel === constants.READ_ONLY || (props.workspace.registration && !props.workspace.registration.selfRegistration) || (props.workspace.registration && !props.workspace.registration.validation)
          }, {
            path: '/parameters',
            component: ParametersTab,
            disabled: permLevel === constants.READ_ONLY && props.context !== toolConstants.TOOL_WORKSPACE
          }, {
            path: '/profile/:publicUrl',
            component: Profile,
            onEnter: () => {
              if (!props.originalUser || props.originalUser.publicUrl !== publicUrl) {
                props.loadUser(publicUrl)
              }
            },
            disabled: props.context !== toolConstants.TOOL_DESKTOP
          },
          {
            path: '/contacts',
            component: UserTab,
            disabled: props.context !== toolConstants.TOOL_DESKTOP
          }

          /*{
            path: '/list',
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
          }*/
        ]}
      />
    </ToolPage>
  )
}

UsersTool.propTypes = {
  context: T.string,
  path: T.string.isRequired,
  location: T.object.isRequired,
  currentUser: T.shape(UserType.propTypes),
  originalUser: T.shape(UserType.propTypes),
  workspace: T.shape(WorkspaceType.propTypes).isRequired,
  registerUsers: T.func.isRequired,
  registerGroups: T.func.isRequired,
  loadUser: T.func.isRequired
}

export {
  UsersTool
}
