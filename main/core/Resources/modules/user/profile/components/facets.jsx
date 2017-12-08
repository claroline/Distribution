import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/core/router'

import {getMainFacet} from '#/main/core/user/profile/utils'

const ProfileFacets = props =>
  <Routes
    routes={[{
      path: `${props.prefix}/:id`,
      onEnter: (params) => props.openFacet(params.id),
      component: props.facetComponent
    }]}

    redirect={[
      {
        from: `${props.prefix}`,
        exact: true,
        to: `${props.prefix}/${getMainFacet(props.facets).id}`
      }
    ]}
  />

ProfileFacets.propTypes = {
  prefix: T.string,
  openFacet: T.func.isRequired,
  facetComponent: T.any.isRequired // todo find better typing
}

ProfileFacets.defaultProps = {
  prefix: ''
}

export {
  ProfileFacets
}
