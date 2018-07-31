import {connect} from 'react-redux'

import {param} from '#/main/app/config'
import {currentUser} from '#/main/core/user/current'

import {selectors} from '#/main/app/overlay/header/store'
import {Header as HeaderComponent} from '#/main/app/overlay/header/components/header'

const Header = connect(
  (state) => ({
    logo: selectors.logo(state),
    title: selectors.title(state),
    subtitle: selectors.subtitle(state),
    help: selectors.help(state),
    currentUser: selectors.user(state),
    authenticated: selectors.authenticated(state),
    workspaces: selectors.workspaces(state),
    locale: selectors.locale(state)
  }),
  (dispatch) => ({

  })
)(HeaderComponent)

export {
    Header
}
