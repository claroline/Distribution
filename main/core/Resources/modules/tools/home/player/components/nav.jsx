import React from 'react'
import {connect} from 'react-redux'

import {NavLink} from '#/main/app/router'

import {select} from '#/main/core/tools/home/selectors'

const PlayerNavComponent = props =>
  <nav className="tool-nav">
    {props.tabs.map((tab, tabIndex) =>
      <NavLink
        className="nav-tab"
        key={tabIndex}
        to={`/tab/${tab.title}`}
      >
        {tab.title}
      </NavLink>
    )}
  </nav>

const PlayerNav = connect(
  (state) => ({
    tabs: select.tabs(state)
  })
)(PlayerNavComponent)

export {
  PlayerNav
}
