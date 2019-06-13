import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {MenuMain as MenuMainComponent} from '#/main/app/layout/menu/components/main'
import {actions, selectors} from '#/main/app/layout/store'

const MenuMain =
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
  )(MenuMainComponent)

export {
  MenuMain
}