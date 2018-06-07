import React from 'react'
// import {PropTypes as T} from 'prop-types'
// import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {NavLink} from '#/main/app/router'


const FlaggedPostsNav = () =>
  <div>
    <h2>{trans('flagged_messages_subjects', {}, 'forum')}</h2>
    <div className="user-profile-aside col-md-3">
      <nav className="user-profile-nav">
        <NavLink
          to='/moderation/flagged/subjects'
          className="user-profile-link"
        >
          {trans('flagged_subjects', {}, 'forum')}
        </NavLink>
        <NavLink
          to='/moderation/flagged/messages'
          className="user-profile-link"
        >
          {trans('flagged_messages', {}, 'forum')}
        </NavLink>
      </nav>
    </div>
  </div>



export {
  FlaggedPostsNav
}
