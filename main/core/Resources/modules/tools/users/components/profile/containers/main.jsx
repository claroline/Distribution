import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {ProfileComponent} from '#/main/core/tools/users/components/profile/components/main.jsx'
import {selectors} from '#/main/app/content/details/store'
import {selectors as profileSelect} from '#/main/core/tools/users/components/profile/store/selectors'

const Profile = withRouter(
  connect(
    (state) => ({
      currentUser: securitySelectors.currentUser(state),
      user: selectors.data(selectors.details(state, profileSelect.FORM_NAME)),
      parameters: profileSelect.parameters(state)
    })
  )(ProfileComponent)
)

export {
  Profile
}
