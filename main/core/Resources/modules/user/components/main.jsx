import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {UserPageContainer} from '#/main/core/user/containers/page'
import {Page as PageTypes} from '#/main/core/layout/page/prop-types'
import {PageContainer} from '#/main/core/layout/page'

const UserMain = props =>
  <PageContainer
    {...props}
    className="user-page"
  >
    <UserPageContainer {...props}   />
  </PageContainer>

implementPropTypes(UserMain, PageTypes, {
  currentUser: T.object,
  user: T.shape({
    name: T.string.isRequired
  }).isRequired,
  children: T.node.isRequired,
  path: T.string.isRequired,
  updatePassword: T.func.isRequired,
  updatePublicUrl: T.func.isRequired
})

export {
  UserMain
}
