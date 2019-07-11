import React from 'react'
import {PropTypes as T} from 'prop-types'

import {UserDetails} from '#/main/core/user/components/details'

import {connectProfile} from '#/main/core/tools/users/components/profile/connect'
import {ProfileNav} from '#/main/core/tools/users/components/profile/components/nav'
import {ProfileFacets} from '#/main/core/tools/users/components/profile/components/facets'
import {selectors as select} from '#/main/core/tools/users/components/profile/store/selectors'
import {selectors} from '#/main/app/content/details/store'
import {ProfileFacet} from '#/main/core/tools/users/components/profile/player/components/facet'

const ProfileShowComponent = props => {
  return (<div className="user-profile row">
    <div className="user-profile-aside col-md-3">
      <UserDetails
        user={props.user}
      />

      {props.facets && 1 < props.facets.length &&
        <ProfileNav
          prefix={props.path+'/show'}
          facets={props.facets}
        />
      }
    </div>

    <div className="user-profile-content col-md-9">
      <ProfileFacets
        prefix={props.path+'/show'}
        facets={props.facets}
        facetComponent={ProfileFacet}
        openFacet={props.openFacet}
      />
    </div>
  </div>)
}

ProfileShowComponent.propTypes = {
  path: T.string,
  user: T.object.isRequired,
  facets: T.array.isRequired,
  openFacet: T.func.isRequired
}

const ProfileShow = connectProfile(
  state => ({
    user: selectors.data(selectors.details(state, select.FORM_NAME)),
    facets: select.facets(state)
  })
)(ProfileShowComponent)

ProfileShow.defaultProps = {
  path: '/desktop/user/profile',
  facets: []
}

export {
  ProfileShow
}
