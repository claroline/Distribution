import React from 'react'
import {PropTypes as T} from 'prop-types'

const Tabs = props =>
  <div>
    <ul className="nav nav-tabs">
      {props.panels.map(panel =>
        <li><a data-toggle="tab" href={panel.href || '#' + panel.name}>{panel.title}</a></li>
      )}
    </ul>
    <div className="tab-content">

    </div>
  </div>


Tabs.propTypes = {
  panels: T.arrayOf(T.shape({
    href: T.string,
    name: T.string.isRequired,
    content: T.any,
    title: T.string.isRequired
  })).isRequired
}

Tabs.defaultProps = {
}
