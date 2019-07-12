import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {matchPath} from '#/main/app/router'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {MenuSection} from '#/main/app/layout/menu/components/section'

const ForumMenu = (props) =>
  <MenuSection
    {...omit(props, 'path')}
    title={
      !!matchPath(props.location.pathname, {path: `${props.path}/moderation/blocked`}) ?
        trans('blocked_messages_subjects', {}, 'forum') :
        !!matchPath(props.location.pathname, {path: `${props.path}/moderation/flagged`}) ?
          trans('flagged_messages_subjects', {}, 'forum') :
          ''
    }
  >
    <Toolbar
      className="list-group"
      buttonName="list-group-item"
      actions={[
        {
          name: 'blocked-subjects',
          type: LINK_BUTTON,
          label: trans('blocked_subjects', {}, 'forum'),
          target: `${props.path}/moderation/blocked/subjects`,
          displayed: !!matchPath(props.location.pathname, {path: `${props.path}/moderation/blocked`})
        }, {
          name: 'blocked-messages',
          type: LINK_BUTTON,
          label: trans('blocked_messages', {}, 'forum'),
          target: `${props.path}/moderation/blocked/messages`,
          displayed: !!matchPath(props.location.pathname, {path: `${props.path}/moderation/blocked`})
        }, {
          name: 'flagged-subjects',
          type: LINK_BUTTON,
          label: trans('flagged_subjects', {}, 'forum'),
          target: `${props.path}/moderation/flagged/subjects`,
          displayed: !!matchPath(props.location.pathname, {path: `${props.path}/moderation/flagged`})
        }, {
          name: 'flagged-messages',
          type: LINK_BUTTON,
          label: trans('flagged_messages', {}, 'forum'),
          target: `${props.path}/moderation/flagged/messages`,
          displayed: !!matchPath(props.location.pathname, {path: `${props.path}/moderation/flagged`})
        }
      ]}
    />
  </MenuSection>

ForumMenu.propTypes = {
  location: T.object.isRequired,
  path: T.string
}

export {
  ForumMenu
}
