import React from 'react'
import {PropTypes as T} from 'prop-types'

import {User as UserType} from '#/main/core/user/prop-types'
import {Workspace as WorkspaceType} from '#/main/core/workspace/prop-types'
import {constants} from '#/main/core/tools/users/constants'
import {getPermissionLevel} from  '#/main/core/tools/users/restrictions'
import {trans} from '#/main/app/intl/translation'
import omit from 'lodash/omit'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {MenuSection} from '#/main/app/layout/menu/components/section'

const UsersMenu = (props) => {
  const permLevel = getPermissionLevel(props.workspace, props.currentUser)

  return (
    <MenuSection
      {...omit(props, 'path')}
      title={trans('users', {}, 'tools')}
    >
      <Toolbar
        className="list-group"
        buttonName="list-group-item"
        actions={[
          {
            name: 'profile',
            type: LINK_BUTTON,
            label: trans('profile'),
            target: props.path+'/profile/' + props.currentUser.publicUrl + '/show',
            displayed: props.context === 'desktop'
          }, {
            name: 'users',
            type: LINK_BUTTON,
            label: trans('list'),
            target: props.path+'/list',
            displayed: props.context === 'desktop'
          },
          {
            name: 'users',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-user',
            label: trans('users'),
            target: `${props.path}/users`,
            displayed: props.context === 'workspace' && !props.workspace.meta.model
          }, {
            name: 'groups',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-users',
            label: trans('groups'),
            target: `${props.path}/groups`,
            displayed: props.context === 'workspace' && !props.workspace.meta.model
          }, {
            name: 'roles',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-id-badge',
            label: trans('roles'),
            target: `${props.path}/roles`,
            displayed: props.context === 'workspace' && permLevel !== constants.READ_ONLY
          }, {
            name: 'pending',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-user-plus',
            label: trans('pending_registrations'),
            target: `${props.path}/pending`,
            displayed: props.context === 'workspace' && permLevel !== constants.READ_ONLY && props.workspace.registration.selfRegistration && props.workspace.registration.validation
          }, {
            name: 'parameters',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-cog',
            label: trans('parameters'),
            target: `${props.path}/parameters`,
            displayed: props.context === 'workspace' && permLevel !== constants.READ_ONLY
          }
        ]}
      />
    </MenuSection>
  )
}

UsersMenu.propTypes = {
  context: T.string,
  path: T.string,
  currentUser: T.shape(UserType.propTypes),
  workspace: T.shape(WorkspaceType.propTypes).isRequired
}

export {
  UsersMenu
}
