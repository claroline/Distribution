import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {ProfileFacet as ProfileFacetTypes} from '#/main/core/user/profile/prop-types'
import {select} from '#/main/core/user/profile/selectors'

// todo manage differences between main / default / plugin facets

const ProfileFacetComponent = props =>
  <div className="profile-facet">
    <h2>{props.facet.title}</h2>

    <FormContainer
      name="user"
      sections={props.facet.sections}
    />
  </div>

ProfileFacetComponent.propTypes = {
  facet: T.shape(
    ProfileFacetTypes.propTypes
  ).isRequired
}

const ProfileFacet = connect(
  state => ({
    facet: select.currentFacet(state)
  })
)(ProfileFacetComponent)

export {
  ProfileFacet
}
