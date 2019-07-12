import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'
import {trans} from '#/main/app/intl/translation'

import {FlaggedMessages} from '#/plugin/forum/resources/forum/moderation/components/flagged-messages'
import {FlaggedSubjects} from '#/plugin/forum/resources/forum/moderation/components/flagged-subjects'

const Flagged = (props) =>
  <Routes
    path={props.path}
    routes={[
      {
        path: '/moderation/flagged/subjects',
        component: FlaggedSubjects
      }, {
        path: '/moderation/flagged/messages',
        component: FlaggedMessages
      }
    ]}
  />

Flagged.propTypes = {
  path: T.string.isRequired
}

export {
  Flagged
}
