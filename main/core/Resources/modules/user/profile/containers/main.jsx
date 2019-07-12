import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'

import {selectors as securitySelectors} from '#/main/app/security/store'
import {ProfileComponent} from '#/main/core/user/profile/components/main.jsx'
import {selectors} from '#/main/app/content/details/store'
import {selectors as profileSelect} from '#/main/core/user/profile/store/selectors'

const Profile = withRouter(
  connect(
    (state) => {
      return {
        path: '/desktop/users/profile',
        currentUser: securitySelectors.currentUser(state),
        user: selectors.data(selectors.details(state, 'users.user')),
        parameters: profileSelect.parameters(state)
      }
    }
  )(ProfileComponent)
)

export {
  Profile
}
