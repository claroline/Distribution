import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {actions} from '#/main/core/user/store/actions'
import {UserMain} from '#/main/core/user/components/main'

/**
 * Connected container for users.
 *
 * Connects the <UserPage> component to a redux store.
 * If you don't use redux in your implementation @see Resource functional component.
 */
const UserMainContainer = withRouter(
  connect(
    (state) =>  {
      return {
        currentUser: securitySelectors.currentUser(state)
      }},
    (dispatch) => ({
      updatePassword(user, password) {
        dispatch(actions.updatePassword(user, password))
      },
      updatePublicUrl(user, publicUrl) {
        dispatch(actions.updatePublicUrl(user, publicUrl, true))
      }
    })
  )(UserMain)
)

export {
  UserMainContainer
}
