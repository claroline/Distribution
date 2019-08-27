import {connect} from 'react-redux'
import {withRouter} from '#/main/app/router'

import {selectors as detailsSelectors} from '#/main/app/content/details/store'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as toolSelectors} from  '#/main/core/tool/store'

import {UserMain as UserMainComponent} from '#/main/core/user/components/main'
import {selectors as profileSelectors} from '#/main/core/user/profile/store/selectors'
import {actions} from '#/main/core/user/store/actions'

const UserMain = withRouter(
  connect(
    (state) => ({
      path: toolSelectors.path(state) + '/profile',
      currentUser: securitySelectors.currentUser(state),
      user: detailsSelectors.data(detailsSelectors.details(state, profileSelectors.FORM_NAME)),
      parameters: profileSelectors.parameters(state),
      loaded: profileSelectors.loaded(state)
    }),
    (dispatch) => ({
      updatePassword(user, password) {
        dispatch(actions.updatePassword(user, password))
      },
      updatePublicUrl(user, publicUrl) {
        dispatch(actions.updatePublicUrl(user, publicUrl, true))
      }
    })
  )(UserMainComponent)
)

export {
  UserMain
}
