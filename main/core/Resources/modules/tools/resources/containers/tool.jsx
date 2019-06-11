import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {ResourcesTool as ResourcesToolComponent} from '#/main/core/tools/resources/components/tool'
import {selectors, actions} from '#/main/core/tools/resources/store'

const ResourcesTool = withRouter(
  connect(
    (state) => ({
      root: selectors.root(state)
    }),
    (dispatch) => ({
      openResource(resourceId) {
        dispatch(actions.openResource(resourceId))
      }
      /*addNodes(resourceNodes) {
        dispatch(explorerActions.addNodes(selectors.STORE_NAME, resourceNodes))
      },

      updateNodes(resourceNodes) {
        dispatch(explorerActions.updateNodes(selectors.STORE_NAME, resourceNodes))
      },

      deleteNodes(resourceNodes) {
        dispatch(explorerActions.deleteNodes(selectors.STORE_NAME, resourceNodes))
      }*/
    })/*,
    undefined,
    {
      areStatesEqual: (next, prev) => selectors.store(prev) === selectors.store(next)
    }*/
  )(ResourcesToolComponent)
)

export {
  ResourcesTool
}
