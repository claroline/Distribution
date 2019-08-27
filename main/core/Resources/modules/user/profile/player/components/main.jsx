import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {selectors as detailsSelectors} from '#/main/app/content/details/store'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {UserDetails} from '#/main/core/user/components/details'
import {ProfileNav} from '#/main/core/user/profile/components/nav'
import {ProfileFacets} from '#/main/core/user/profile/components/facets'
import {ProfileFacet} from '#/main/core/user/profile/player/components/facet'
import {actions, selectors} from '#/main/core/user/profile/store'

const ProfileShowComponent = props =>
  <div className="user-profile row">
    <div className="user-profile-aside col-md-3">
      <UserDetails
        user={props.user}
      />

      {props.facets && 1 < props.facets.length &&
        <ProfileNav
          prefix={props.path + '/profile/' + props.user.publicUrl + '/show'}
          facets={props.facets}
        />
      }
    </div>

    <div className="user-profile-content col-md-9">
      <ProfileFacets
        prefix={props.path + '/profile/' + props.user.publicUrl + '/show'}
        facets={props.facets}
        facetComponent={ProfileFacet}
        openFacet={props.openFacet}
      />
    </div>
  </div>

ProfileShowComponent.propTypes = {
  path: T.string,
  user: T.object.isRequired,
  facets: T.array.isRequired,
  openFacet: T.func.isRequired
}

ProfileShowComponent.defaultProps = {
  facets: []
}

const ProfileShow = connect(
  (state) => ({
    path: toolSelectors.path(state),
    user: detailsSelectors.data(detailsSelectors.details(state, selectors.FORM_NAME)),
    facets: selectors.facets(state)
  }),
  (dispatch) => ({
    openFacet(id) {
      dispatch(actions.openFacet(id))
    }
  })
)(ProfileShowComponent)

export {
  ProfileShow
}
