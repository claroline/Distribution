import React from 'react'
// import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {FlaggedMessages} from '#/plugin/forum/resources/forum/moderation/components/flagged-messages'
import {FlaggedSubjects} from '#/plugin/forum/resources/forum/moderation/components/flagged-subjects'

const FlaggedPosts= () =>
  <Routes
    routes={[
      {
        path: '/moderation/flagged-subjects',
        component: FlaggedSubjects,
        exact: true
      }, {
        path: '/moderation/flagged-messages',
        component: FlaggedMessages,
        exact: true
      }
    ]}
  />


export {
  FlaggedPosts
}
