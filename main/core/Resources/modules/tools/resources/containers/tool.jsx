import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {actions as listActions} from '#/main/app/content/list/store'

import {ResourcesTool as ResourcesToolComponent} from '#/main/core/tools/resources/components/tool'
import {selectors} from '#/main/core/tools/resources/store'

const ResourcesTool = withRouter(
  connect(
    (state) => ({
      root: selectors.root(state),
      listRootName: selectors.LIST_ROOT_NAME
    }),
    (dispatch) => ({
      updateNodes() {
        dispatch(listActions.invalidateData(selectors.LIST_ROOT_NAME))
      },

      deleteNodes() {
        dispatch(listActions.invalidateData(selectors.LIST_ROOT_NAME))
      }
    })
  )(ResourcesToolComponent)
)

export {
  ResourcesTool
}
