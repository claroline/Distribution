import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {actions as walkthroughActions} from '#/main/app/overlays/walkthrough/store'

import {selectors, reducer} from '#/main/app/layout/header/store'
import {Header as HeaderComponent} from '#/main/app/layout/header/components/header'

const Header = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      mainMenu: selectors.mainMenu(state),
      logo: selectors.logo(state),
      title: selectors.title(state),
      subtitle: selectors.subtitle(state),
      display: selectors.display(state),
      count: selectors.count(state),
      helpUrl: selectors.helpUrl(state),
      loginUrl: selectors.loginUrl(state),
      registrationUrl: selectors.registrationUrl(state),
      currentUser: selectors.user(state),
      authenticated: selectors.authenticated(state),
      locale: selectors.locale(state),
      administration: selectors.administration(state),
      tools: selectors.tools(state),
      notificationTools: selectors.notificationTools(state),
      redirectHome: selectors.redirectHome(state)
    }),
    (dispatch) => ({
      startWalkthrough(steps, additional, documentation) {
        dispatch(walkthroughActions.start(steps, additional, documentation))
      }
    })
  )(HeaderComponent)
)

export {
  Header
}
