import {Component, createElement} from 'react'
import {Provider, ReactReduxContext} from 'react-redux'
import invariant from 'invariant'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * HOC permitting to dynamically append the reducer needed by a container.
 *
 * @param {string} key
 * @param {object} reducer
 *
 * @return {func}
 */
function withReducer(key, reducer) {
  return function appendReducers(WrappedComponent) {
    const wrappedDisplayName = `WithReducers(${getDisplayName(WrappedComponent)})`

    // maybe use a static component
    // (advantage of class is the reducers are appended before the first rendering)
    class WithReducers extends Component {
      constructor(props, context) {
        super(props, context)

        invariant(context.store,
          `Could not find "store" in the context of ${wrappedDisplayName}. You may have called withReducers outside <Provider>.`
        )

        context.store.injectReducer(key, reducer)
      }

      render() {
        // Provider is required to make the new store available to the React sub-tree
        return createElement(Provider, {
          store: this.context.store
        }, createElement(WrappedComponent, this.props))
      }
    }

    WithReducers.displayName = wrappedDisplayName
    WithReducers.contextType = ReactReduxContext

    return WithReducers
  }
}

export {
  withReducer
}
