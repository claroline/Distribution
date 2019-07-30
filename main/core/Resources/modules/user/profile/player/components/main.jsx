import React from 'react'
import {PropTypes as T} from 'prop-types'

import {UserDetails} from '#/main/core/user/components/details'

import {connectProfile} from '#/main/core/user/profile/connect'
import {ProfileNav} from '#/main/core/user/profile/components/nav'
import {ProfileFacets} from '#/main/core/user/profile/components/facets'
import {selectors as select} from '#/main/core/user/profile/store/selectors'
import {selectors} from '#/main/app/content/details/store'
import {ProfileFacet} from '#/main/core/user/profile/player/components/facet'
import {selectors as toolSelectors} from '#/main/core/tool/store'

const ProfileShowComponent = props => <div className="user-profile row">
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

const ProfileShow = connectProfile(
  (state) => ({
    path: toolSelectors.path(state),
    user: selectors.data(selectors.details(state, select.FORM_NAME)),
    facets: select.facets(state)
  })
)(ProfileShowComponent)

ProfileShow.defaultProps = {
  facets: []
}

export {
  ProfileShow
}
