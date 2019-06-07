import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {LayoutMenu as LayoutMenuComponent} from '#/main/app/layout/components/menu'
import {actions, selectors} from '#/main/app/layout/store'

const LayoutMenu =
  connect(
    (state) => ({
      section: selectors.menuSection(state)
    }),
    (dispatch) => ({
      /**
       * Open/close the main app menu.
       */
      changeSection(section) {
        dispatch(actions.changeMenuSection(section))
      }
    })
  )(LayoutMenuComponent)

export {
  LayoutMenu
}