import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {select} from '#/main/core/user/profile/selectors'

// todo manage differences between main / default / plugin facets

const ProfileFacetComponent = props =>
  <div className="profile-facet">
    <h2>{props.facet.title}</h2>
  </div>

ProfileFacetComponent.propTypes = {
  //title: T.string.isRequired
}

const ProfileFacet = connect(
  state => ({
    facet: select.currentFacet(state)
  })
)(ProfileFacetComponent)

export {
  ProfileFacet
}
