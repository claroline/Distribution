import React from 'react'
// import {PropTypes as T} from 'prop-types'
// import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/app/router'
// import {actions as listActions} from '#/main/core/data/list/actions'
//
// import {actions} from '#/plugin/forum/resources/forum/player/actions'
// import {select} from '#/plugin/forum/resources/forum/selectors'
import {FlaggedMessages} from '#/plugin/forum/resources/forum/moderation/components/flagged-messages'

const FlaggedPosts= () =>
  <div>
    <h2>{trans('flagged_messages_subjects', {}, 'forum')}</h2>
    <div className="user-profile-aside col-md-3">
      <nav className="user-profile-nav">
        <NavLink
          to='/moderation/blocked'
          className="user-profile-link"
        >
          ok
        </NavLink>
      </nav>
    </div>
    <div className="user-profile-content col-md-9">
      <FlaggedMessages />
    </div>
  </div>


// const FlaggedPosts = connect(
//   state => ({
//     forum: select.forum(state),
//     subject: select.subject(state)
//   }),
//   dispatch => ({
//     unFlag(message, subjectId) {
//       dispatch(actions.unFlag(message, subjectId))
//       dispatch(listActions.invalidateData('moderation.flaggedMessages'))
//     }
//   })
// )(FlaggedPostsComponent)

export {
  FlaggedPosts
}
