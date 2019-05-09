import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {withReducer} from '#/main/app/store/components/withReducer'

import {DesktopMain as DesktopMainComponent} from '#/main/app/layout/sections/desktop/components/main'
import {actions, reducer, selectors} from '#/main/app/layout/sections/desktop/store'

import {actions as toolActions} from '#/main/core/tool/store'

const DesktopMain = withRouter(
  withReducer(selectors.STORE_NAME, reducer)(
    connect(
      (state) => ({
        loaded: selectors.loaded(state),
        defaultOpening: selectors.defaultOpening(state),
        tools: selectors.tools(state)
      }),
      (dispatch) => ({
        open(loaded) {
          if (loaded) {
            return Promise.resolve(true)
          }

          return dispatch(actions.open())
        },

        openTool(toolName) {
          return dispatch(actions.openTool(toolName))
        },

        setTool(toolName) {
          dispatch(toolActions.open(toolName))
        }
      })
    )(DesktopMainComponent)
  )
)

export {
  DesktopMain
}
