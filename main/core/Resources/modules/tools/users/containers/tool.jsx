import {connect} from 'react-redux'

import {selectors as detailsSelectors} from '#/main/app/content/details/store'

import {selectors} from '#/main/core/tools/users/store'
import {UsersTool as UsersToolComponent} from '#/main/core/tools/users/components/tool'

const UsersTool = connect(
  (state) => ({
    user: detailsSelectors.data(detailsSelectors.details(state, selectors.STORE_NAME + '.user'))
  })
)(UsersToolComponent)

export {
  UsersTool
}
