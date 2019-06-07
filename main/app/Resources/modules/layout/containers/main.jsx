import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {LayoutMain as LayoutMainComponent} from '#/main/app/layout/components/main'
import {actions, selectors} from '#/main/app/layout/store'

const LayoutMain = withRouter(
  connect(
    (state) => ({
      maintenance: selectors.maintenance(state),
      impersonated: selectors.impersonated(state),
      menuOpened: selectors.menuOpened(state),
      sidebar: selectors.sidebar(state)
    }),
    (dispatch) => ({
      /**
       * Open/close the main app menu.
       */
      toggleMenu() {
        dispatch(actions.toggleMenu())
      },

      openSidebar(toolName) {
        dispatch(actions.openSidebar(toolName))
      },
      closeSidebar() {
        dispatch(actions.closeSidebar())
      }
    })
  )(LayoutMainComponent)
)

export {
  LayoutMain
}