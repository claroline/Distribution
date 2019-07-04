import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {HistoryMenu as HistoryMenuComponent} from '#/main/core/header/history/components/menu'
import {actions, reducer, selectors} from '#/main/core/header/history/store'

const HistoryMenu = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({

    }),
    (dispatch) => ({
      loadMenu() {
        dispatch(actions.fetchMenu())
      }
    })
  )(HistoryMenuComponent)
)

export {
  HistoryMenu
}
