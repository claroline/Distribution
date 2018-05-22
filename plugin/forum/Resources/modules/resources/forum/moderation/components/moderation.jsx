import React from 'react'
// import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'

const Moderation = () =>
  <div>
    {/* <h2>{trans('moderation', {}, 'forum')}</h2> */}
    <TabbedPageContainer
      title={trans('moderation', {}, 'forum')}
      tabs={[
        {
          icon: 'fa fa-flag',
          title: trans('flagged_messages_subjects', {}, 'forum'),
          path: '/flagged',
          // content: UserTab,
          //perm check here for creation
          // actions: permLevel === MANAGER || permLevel === ADMIN ? UserTabActions: null,
          displayed: true
        },
        {
          icon: 'fa fa-ban',
          title: trans('moderated_posts', {}, 'forum'),
          path: '/moderated',
          // content: UserTab,
          // //perm check here for creation
          // actions: permLevel === MANAGER || permLevel === ADMIN ? UserTabActions: null,
          displayed: true
        }
      ]}
    />
  </div>

export {
  Moderation
}
