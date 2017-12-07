import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {withRouter} from '#/main/core/router'
import {generateUrl} from '#/main/core/fos-js-router'
import {t} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

import {UserPageContainer} from '#/main/core/user/containers/page.jsx'

import {ProfileEdit} from '#/main/core/user/profile/editor/components/main.jsx'
import {ProfileShow} from '#/main/core/user/profile/player/components/main.jsx'

const ProfileComponent = props =>
  <UserPageContainer
    customActions={[
      {
        icon: 'fa fa-fw fa-line-chart',
        label: t('show_tracking'),
        displayed: props.user.rights.current.edit,
        action: generateUrl('claro_user_tracking', {publicUrl: props.user.meta.publicUrl})
      }
    ]}
  >
    <Routes
      routes={[
        {
          path: '/show',
          component: ProfileShow
        }, {
          path: '/edit',
          component: ProfileEdit
        }
      ]}
      redirect={[
        {from: '/', exact: true, to: '/show'}
      ]}
    />
  </UserPageContainer>

ProfileComponent.propTypes = {
  user: T.shape({
    meta: T.shape({
      publicUrl: T.string.isRequired
    }).isRequired,
    rights: T.shape({
      current: T.shape({
        edit: T.bool.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
}

const Profile = connect(
  state => ({
    user: state.user
  }),
  dispatch => ({

  })
)(ProfileComponent)

export {
  Profile
}
