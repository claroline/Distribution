import React from 'react'

import {NavLink} from '#/main/app/router'

const PlayerNav = props =>
  <div>
    <nav>
      {props.tabs.map((tab, tabIndex) =>
        <NavLink
          className="nav nav-tab"
          key={tabIndex}
          to="/edit"
          activeClassName=""
        >
          {tab.name}
        </NavLink>
      )}
    </nav>
    {props.children}
  </div>


export {
  PlayerNav
}
