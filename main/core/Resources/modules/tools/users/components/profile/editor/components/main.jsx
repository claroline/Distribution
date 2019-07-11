import React from 'react'
import {PropTypes as T} from 'prop-types'

import {UserDetails} from '#/main/core/user/components/details'
import {connectProfile} from '#/main/core/tools/users/components/profile/connect'
import {ProfileNav} from '#/main/core/tools/users/components/profile/components/nav'
import {ProfileFacets} from '#/main/core/tools/users/components/profile/components/facets'

import {selectors as select} from '#/main/app/content/form/store/selectors'
import {selectors as profileSelector} from '#/main/core/tools/users/components/profile/store/selectors'
import {selectors as baseSelector} from '#/main/core/tools/users/store'
import {selectors} from '#/main/app/content/details/store'
import {ProfileFacet} from '#/main/core/tools/users/components/profile/editor/components/facet'

const ProfileEditComponent = props =>
  <div className="row user-profile user-profile-edit">
    <div className="user-profile-aside col-md-3">
      <UserDetails
        user={props.user}
      />

      {1 < props.facets.length &&
        <ProfileNav
          prefix={props.path + '/edit'}
          facets={props.facets}
        />
      }
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
  (state) => {return 
    console.log(state)
    {
    path:'/desktop/users/profile',
    user: selectors.data(selectors.details(state, select.FORM_NAME)),
    //user: select.data(select.form(state, baseSelector.FORM_NAME)),
    facets: profileSelector.facets(state)
  }}
)(ProfileEditComponent)

export {
  ProfileEdit
}
