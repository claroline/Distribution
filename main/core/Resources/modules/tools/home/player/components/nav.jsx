import React from 'react'

import {NavLink} from '#/main/app/router'

const PlayerNav = props =>
  <div>
    <nav className="tool-nav">
      {props.tabs.map((tab, tabIndex) =>
        <a
          className="nav-tab"
          key={tabIndex}
          to="/edit"
        >
          {tab.name}
        </a>
      )}
    </nav>
    {/* {props.children} */}
  </div>


export {
  PlayerNav
}
