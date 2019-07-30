import React from 'react'
import {PropTypes as T} from 'prop-types'

import {UserDetails} from '#/main/core/user/components/details'
import {connectProfile} from '#/main/core/user/profile/connect'
import {ProfileNav} from '#/main/core/user/profile/components/nav'
import {ProfileFacets} from '#/main/core/user/profile/components/facets'

import {selectors as select} from '#/main/app/content/form/store/selectors'
import {selectors as profileSelector} from '#/main/core/user/profile/store/selectors'
import {ProfileFacet} from '#/main/core/user/profile/editor/components/facet'

const ProfileEditComponent = props =>
  <div className="row user-profile user-profile-edit">
    <div className="user-profile-aside col-md-3">
      <UserDetails
        user={props.user}
      />

      <ProfileNav
        prefix={props.path + '/edit'}
        facets={props.facets}
      />
    </div>

    <div className="user-profile-content col-md-9">
      <ProfileFacets
        prefix={props.path + '/edit'}
        facets={props.facets}
        facetComponent={ProfileFacet}
        openFacet={props.openFacet}
      />
    </div>
  </div>

ProfileEditComponent.propTypes = {
  user: T.object.isRequired,
  facets: T.array.isRequired,
  openFacet: T.func.isRequired,
  path: T.string
}

const ProfileEdit = connectProfile(
  (state) => {
    return  {
      user: select.data(select.form(state, profileSelector.FORM_NAME))
    }
  }
)(ProfileEditComponent)

export {
  ProfileEdit
}
