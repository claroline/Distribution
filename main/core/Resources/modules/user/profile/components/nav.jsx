import React from 'react'
import {PropTypes as T} from 'prop-types'

import {NavLink} from '#/main/core/router'

const ProfileNav = props =>
  <nav className="user-profile-nav">
    {props.facets.map(facet =>
      <NavLink
        key={facet.id}
        to={`${props.prefix}/${facet.id}`}
        className="user-profile-link"
      >
        {facet.icon &&
          <span className={facet.icon} />
        }

        {facet.title}
      </NavLink>
    )}
  </nav>

ProfileNav.propTypes = {
  prefix: T.string,
  facets: T.arrayOf(T.shape({
    id: T.string.isRequired,
    icon: T.string,
    title: T.string.isRequired
  })).isRequired
}

ProfileNav.defaultProps = {
  prefix: ''
}

export {
  ProfileNav
}
