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
    path={props.path}
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/show',
          component: () => {
            const WithPathShow = <ProfileShow path={props.path}/>

            return WithPathShow
          }
        }, {
          path: '/edit',
          component: () => {
            const WithPathEdit = <ProfileEdit path={props.path}/>

            return WithPathEdit
          },
          disabled: !props.currentUser || (props.user.username !== props.currentUser.username &&
            props.currentUser.roles.filter(r => ['ROLE_ADMIN'].concat(props.parameters['roles_edition']).indexOf(r.name) > -1).length === 0
          )
        }, {
          path: '/badges/:id',
          component: ProfileBadgeList
        }
      ]}
      redirect={[
        {from: props.path, exact: true, to: props.path + '/show'}
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
