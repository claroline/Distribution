import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {BlockedMessages} from '#/plugin/forum/resources/forum/moderation/components/blocked-messages'
import {BlockedSubjects} from '#/plugin/forum/resources/forum/moderation/components/blocked-subjects'

const Blocked = (props) =>
  <Routes
    path={props.path}
    routes={[
      {
        path: '/moderation/blocked/subjects',
        component: BlockedSubjects
      }, {
        path: '/moderation/blocked/messages',
        component: BlockedMessages
      }
    ]}
  />

Blocked.propTypes = {
  path: T.string.isRequired
}

export {
  Blocked
}
