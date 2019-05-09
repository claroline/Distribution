import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {withReducer} from '#/main/app/store/components/withReducer'

import {DesktopMenu as DesktopMenuComponent} from '#/main/app/layout/sections/desktop/components/menu'
import {reducer, selectors} from '#/main/app/layout/sections/desktop/store'

const DesktopMenu = withRouter(
  withReducer(selectors.STORE_NAME, reducer)(
    connect(
      (state) => ({
        tools: selectors.tools(state)
      })
    )(DesktopMenuComponent)
  )
)

export {
  DesktopMenu
}
