import {connect} from 'react-redux'

// the component to connect
import {ResourcePage as ResourcePageComponent} from '#/main/core/resource/components/page'
// the store to use
import {actions, selectors} from '#/main/core/resource/store'

/**
 * Connected container for resources.
 *
 * Connects the <Resource> component to a redux store.
 * If you don't use redux in your implementation @see Resource functional component.
 */
const ResourcePage = connect(
  (state) => ({
    embedded: selectors.embedded(state),
    resourceNode: selectors.resourceNode(state),
    userEvaluation: selectors.resourceEvaluation(state)
  }),
  (dispatch) => ({
    updateNode(resourceNode) {
      dispatch(actions.updateNode(resourceNode))
    },
    loadResource(resourceNode) {
      dispatch(actions.fetchResource(resourceNode))
    }
  })
)(ResourcePageComponent)

export {
  ResourcePage
}
