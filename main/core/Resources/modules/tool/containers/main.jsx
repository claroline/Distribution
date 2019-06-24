import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {withReducer} from '#/main/app/store/components/withReducer'

import {ToolMain as ToolMainComponent} from '#/main/core/tool/components/main'
import {actions, reducer, selectors} from '#/main/core/tool/store'

const ToolMain = withRouter(
  withReducer(selectors.STORE_NAME, reducer)(
    connect(
      (state) => ({
        loaded: selectors.loaded(state)
      }),
      (dispatch) => ({
        /*open(name, context, basePath) {
          dispatch(actions.open(name, context, basePath))
        },*/
        close() {
          dispatch(actions.close())
        }
      })
    )(ToolMainComponent)
  )
)

export {
  ToolMain
}
