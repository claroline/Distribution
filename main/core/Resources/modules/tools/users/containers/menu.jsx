import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {selectors as detailsSelectors} from '#/main/app/content/details/store'

import {selectors} from '#/main/core/tools/users/store'
import {UsersMenu as UsersMenuComponent} from '#/main/core/tools/users/components/menu'

const UsersMenu = withRouter(connect(
  (state) => ({
    user: detailsSelectors.data(detailsSelectors.details(state, selectors.STORE_NAME + '.user'))
  })
)(UsersMenuComponent))

export {
  UsersMenu
}
