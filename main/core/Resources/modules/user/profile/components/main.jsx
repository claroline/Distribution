import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'
import {UserPageContainer} from '#/main/core/user/containers/page'
import {User as UserTypes} from '#/main/core/user/prop-types'

import {ProfileEdit} from '#/main/core/user/profile/editor/components/main'
import {ProfileShow} from '#/main/core/user/profile/player/components/main'
import {ProfileBadgeList} from '#/plugin/open-badge/tools/badges/badge/components/profile-badges'

const ProfileComponent = props =>
  <UserPageContainer
    user={props.user}
    path={props.path + '/' + props.user.publicUrl}
  >
    <Routes
      path={props.path + '/' + props.user.publicUrl}
      routes={[
        {
          path: '/show',
          component: ProfileShow
        }, {
          path: '/edit',
          component: ProfileEdit,
          disabled: !props.currentUser || (props.user.username !== props.currentUser.username &&
            props.currentUser.roles.filter(r => ['ROLE_ADMIN'].concat(props.parameters['roles_edition']).indexOf(r.name) > -1).length === 0
          )
        }, {
          path: '/badges/:id',
          component: ProfileBadgeList
        }
      ]}
      redirect={[
        {from: props.path + '/' + props.user.publicUrl + '/show', exact: true, to: props.path  + '/' + props.user.publicUrl+ '/show/main'},
        {from: props.path + '/' + props.user.publicUrl, exact: true, to: props.path  + '/' + props.user.publicUrl+ '/show/main'}
      ]}
    />
  </UserPageContainer>

ProfileComponent.propTypes = {
  user: T.shape(
    UserTypes.propTypes
  ).isRequired,
  currentUser: T.shape(
    UserTypes.propTypes
  ).isRequired,
  path: T.string,
  parameters: T.object.isRequired
}

export {
  ProfileComponent
}
