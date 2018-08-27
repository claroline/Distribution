import React from 'react'

import {Routes} from '#/main/app/router'
import {trans} from '#/main/core/translation'

import {BlockedMessages} from '#/plugin/forum/resources/forum/moderation/components/flagged-messages'
import {BlockedSubjects} from '#/plugin/forum/resources/forum/moderation/components/flagged-subjects'
import {BlockedPostsNav} from '#/plugin/forum/resources/forum/moderation/components/flagged-posts-nav'

const Blocked = () =>
  <div>
    <h2>{trans('blocked_messages_subjects', {}, 'forum')}</h2>
    <div className="row">
      <div className="col-md-3">
        <BlockedPostsNav />
      </div>
      <div className="col-md-9">
        <Routes
          routes={[
            {
              path: '/moderation/flagged/subjects',
              component: BlockedSubjects
            }, {
              path: '/moderation/flagged/messages',
              component: BlockedMessages
            }
          ]}
        />
      </div>
    </div>
  </div>

export {
  Blocked
}
